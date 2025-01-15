import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { TrashService } from 'src/trash/trash.service'
import {
  CreateProjectDto,
  CreateProjectItemDto,
  DeleteManyProjectDto,
  FindManyProjectDto,
  FindManyQuotationDto,
  UpdateProjectDto
} from './dto/project.dto'
import { Prisma, PrismaClient, ProjectStatus } from '.prisma/client'
import { generateCodeUUID, paginate } from 'utils/helper'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import {
  productCaptureSelect,
  projectSelect,
  quotationDetailSelect
} from 'responses'

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateProjectDto, userId: string) {
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
          select: productCaptureSelect
        })

        if (!product)
          throw new HttpException(
            `Không tìm thấy sản phẩm với ID: ${item.productId}!`,
            HttpStatus.NOT_FOUND
          )

        return {
          productId: product.id,
          productCapture: product,
          quantity: item.quantity
        }
      })
    )

    return data
  }

  async update(id: string, data: UpdateProjectDto, userId: string) {
    const projectItems = await this.getProjectItems(data.projectItems)

    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.projectItem.deleteMany({ where: { projectId: id } })

      return prisma.project.update({
        where: {
          id,
          creatorId: userId
        },
        data: {
          name: data.name,
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

  async findMany(data: FindManyProjectDto, userId: string) {
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
      creatorId: userId
    }

    return await paginate(
      this.prisma.project,
      {
        where,
        select: projectSelect,
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

  async findOne(id: string, userId: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: { id, creatorId: userId },
      select: projectSelect
    })
  }

  async deleteMany(data: DeleteManyProjectDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataProject: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Project',
        include: {
          projectItems: true
        }
      }

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

  async delete(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Project',
        include: {
          projectItems: true
        }
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.project.delete({
        where: { id, creatorId: userId },
        include: {
          projectItems: true
        }
      })
    })
  }

  async findManyQuotation(
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
        select: quotationDetailSelect,
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
}
