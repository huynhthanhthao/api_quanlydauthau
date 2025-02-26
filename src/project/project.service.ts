import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { TrashService } from 'src/trash/trash.service'
import {
  CreateProjectDto,
  CreateProjectItemDto,
  DeleteManyProjectDto,
  FindManyProjectDto,
  FindManyQuotationDto,
  UpdateIsEditableDto,
  UpdateProjectDto
} from './dto/project.dto'
import { Prisma, PrismaClient, ProjectStatus } from '.prisma/client'
import { generateCodeUUID, paginate } from 'utils/helper'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import {
  productQuotationSelect,
  publicProjectSelect,
  projectSelect,
  quotationDetailSelect,
  publicProjectDetailSelect,
  quotationSelect,
  projectSelectByAdmin
} from 'responses'

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async createMyProject(data: CreateProjectDto, userId: string) {
    const projectItems = await this.getProjectItems(data.projectItems)

    return this.prisma.project.create({
      data: {
        name: data.name,
        code: generateCodeUUID(),
        status: ProjectStatus.PENDING,
        price: data.price,
        address: data.address,
        desc: data.desc,
        creatorId: userId,
        projectItems: {
          create: projectItems
        }
      },
      include: {
        projectItems: true
      }
    })
  }

  async getProjectItems(projectItems: CreateProjectItemDto[]) {
    if (!projectItems || projectItems.length === 0) return []

    const data = await Promise.all(
      projectItems.map(async item => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: productQuotationSelect
        })

        if (!product)
          throw new HttpException(
            `Không tìm thấy sản phẩm với ID: ${item.productId}!`,
            HttpStatus.NOT_FOUND
          )

        return {
          productId: product.id,
          productCapture: product,
          quantity: item.quantity,
          unit: item.unit
        }
      })
    )

    return data
  }

  async updateMyProject(id: string, data: UpdateProjectDto, userId: string) {
    const currentProject = await this.prisma.project.findFirstOrThrow({
      where: { id },
      select: { status: true, creatorId: true, isEditable: true }
    })

    if (!currentProject.isEditable)
      throw new HttpException(`Không thể cập nhật dự án.`, HttpStatus.CONFLICT)

    const projectItems = await this.getProjectItems(data.projectItems)

    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.projectItem.deleteMany({ where: { projectId: id } })

      return prisma.project.update({
        where: { id },
        data: {
          name: data.name,
          isEditable: false,
          price: data.price,
          address: data.address,
          desc: data.desc,
          updaterId: userId,
          projectItems: {
            create: projectItems
          }
        },
        include: {
          projectItems: true
        }
      })
    })
  }

  async findMyProjects(data: FindManyProjectDto, userId: string) {
    const conditions: Prisma.ProjectWhereInput = {
      creatorId: userId
    }

    return this.findManyBase(conditions, data, projectSelect)
  }

  async findMany(data: FindManyProjectDto) {
    const conditions: Prisma.ProjectWhereInput = {}

    return this.findManyBase(conditions, data, projectSelect)
  }

  async findPublicProjects(data: FindManyProjectDto) {
    const { statuses } = data

    const conditions: Prisma.ProjectWhereInput = {
      AND: [
        {
          status: {
            in: ['APPROVED', 'QUOTED']
          }
        },
        {
          ...(statuses && {
            status: {
              in: statuses
            }
          })
        }
      ]
    }

    return this.findManyBase(conditions, data, publicProjectSelect)
  }

  async findOnePublicProject(id: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: {
        id,
        status: {
          in: ['APPROVED', 'QUOTED']
        }
      },
      select: publicProjectDetailSelect
    })
  }

  async findManyBase(
    conditions: Prisma.ProjectWhereInput,
    data: FindManyProjectDto,
    select: Prisma.ProjectSelect
  ) {
    const { page, perPage, keyword, orderKey, orderValue, statuses } = data

    const keySearch = ['name', 'desc', 'code', 'address']

    const where: Prisma.ProjectWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      ...(statuses && {
        status: {
          in: statuses
        }
      }),
      ...conditions
    }

    return await paginate(
      this.prisma.project,
      {
        where,
        select: select,
        orderBy: {
          [orderKey]: orderValue
        }
      },
      {
        page,
        perPage
      }
    )
  }

  async findOneByMe(id: string, userId: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: { id, creatorId: userId },
      select: projectSelect
    })
  }

  async findOne(id: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: { id },
      select: projectSelectByAdmin
    })
  }

  async deleteManyMyProjects(data: DeleteManyProjectDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataProject: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Project',
        include: {
          projectItems: true,
          quotations: {
            include: {
              quotationHistories: true,
              items: true
            }
          }
        }
      }

      const projects = await prisma.project.findMany({
        where: {
          id: { in: data.ids },
          creatorId: userId
        },
        include: {
          projectItems: true,
          quotations: {
            include: {
              quotationHistories: true,
              items: true
            }
          }
        }
      })

      projects.forEach(project =>
        this.validateProjectStatus(project.status, ['PENDING'], 'xóa')
      )

      await this.trashService.createMany(dataProject, prisma)

      return prisma.project.deleteMany({
        where: {
          id: {
            in: data.ids
          },
          creatorId: userId
        }
      })
    })
  }

  async deleteMyProject(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const project = await prisma.project.findUniqueOrThrow({ where: { id } })

      this.validateProjectStatus(project.status, ['PENDING'], 'xóa')

      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Project',
        include: {
          projectItems: true,
          quotations: {
            include: {
              quotationHistories: true,
              items: true
            }
          }
        }
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.project.delete({
        where: { id, creatorId: userId },
        include: {
          projectItems: true,
          quotations: {
            include: {
              quotationHistories: true,
              items: true
            }
          }
        }
      })
    })
  }

  async findManyQuotationInMyProjects(
    projectId: string,
    data: FindManyQuotationDto,
    userId: string
  ) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'desc']

    const where: Prisma.QuotationWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      project: {
        id: projectId,
        creatorId: userId
      }
    }

    return await paginate(
      this.prisma.quotation,
      {
        where,
        select: quotationSelect,
        orderBy: {
          [orderKey]: orderValue
        }
      },
      {
        page,
        perPage
      }
    )
  }

  async findOneQuotationInMyProject(
    quotationId: string,
    projectId: string,
    userId: string
  ) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: {
        id: quotationId,
        project: {
          creatorId: userId,
          id: projectId
        }
      },
      select: quotationDetailSelect
    })
  }

  async cancelMyProject(id: string, userId: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id },
      select: { status: true }
    })

    this.validateProjectStatus(
      project.status,
      ['PENDING', 'APPROVED', 'QUOTED'],
      'hủy'
    )

    return this.prisma.project.update({
      where: { id, creatorId: userId },
      data: {
        status: ProjectStatus.CANCELED,
        updaterId: userId
      }
    })
  }

  async approve(id: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id },
      select: { status: true }
    })

    this.validateProjectStatus(project.status, ['PENDING'], 'duyệt')

    return this.prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.APPROVED
      }
    })
  }

  async cancel(id: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id },
      select: { status: true }
    })

    this.validateProjectStatus(
      project.status,
      ['PENDING', 'APPROVED', 'QUOTED'],
      'hủy'
    )

    return this.prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.CANCELED
      }
    })
  }

  async complete(id: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id },
      select: { status: true, isEditable: true }
    })

    if (project.isEditable)
      throw new HttpException(
        `Không thể duyệt hoàn thành dự án này.`,
        HttpStatus.CONFLICT
      )

    this.validateProjectStatus(project.status, ['QUOTED'], 'duyệt hoàn thành')

    return this.prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.COMPLETED
      }
    })
  }

  async toggleRequestEdit(id: string, data: UpdateIsEditableDto) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id },
      select: { status: true }
    })

    this.validateProjectStatus(
      project.status,
      ['PENDING', 'APPROVED', 'QUOTED'],
      'yêu cầu chỉnh sửa'
    )

    return this.prisma.project.update({
      where: { id },
      data: {
        isEditable: data.isEditable
      }
    })
  }

  async validateProjectStatus(
    status: ProjectStatus,
    validStatuses: ProjectStatus[],
    action: string
  ) {
    if (!validStatuses.includes(status)) {
      throw new HttpException(
        `Không thể ${action} dự án ở trạng thái này.`,
        HttpStatus.CONFLICT
      )
    }
  }
}
