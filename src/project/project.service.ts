import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { TrashService } from 'src/trash/trash.service'
import {
  CreateProjectDto,
  DeleteManyProjectDto,
  FindManyProjectDto,
  UpdateProjectDto
} from './dto/project.dto'
import { Prisma, PrismaClient, ProjectStatus } from '.prisma/client'
import { generateCodeUUID, paginate } from 'utils/helper'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { projectSelect } from 'responses/project.response'
import { permissions } from 'enums'

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateProjectDto, userId: string) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        code: generateCodeUUID(),
        status: ProjectStatus.PENDING,
        address: data.address,
        investorId: data.investorId,
        inviterId: data.inviterId,
        priorityId: data.priorityId,
        estDeadline: data.estDeadline,
        estimators: {
          connect: data.estimatorIds?.map(id => ({ id }))
        },
        creatorId: userId
      }
    })
  }

  async update(id: string, data: UpdateProjectDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const project = await prisma.project.findUniqueOrThrow({ where: { id } })

      this.validateProjectStatus(
        project.status,
        ['EDIT_REQUESTED'],
        'cập nhật!'
      )

      return prisma.project.update({
        where: { id, creatorId: userId },
        data: {
          name: data.name,
          address: data.address,
          investorId: data.investorId,
          inviterId: data.inviterId,
          priorityId: data.priorityId,
          estDeadline: data.estDeadline,
          estimators: {
            set: data.estimatorIds?.map(id => ({ id }))
          },
          updaterId: userId
        }
      })
    })
  }

  async delete(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const project = await prisma.project.findUniqueOrThrow({ where: { id } })

      this.validateProjectStatus(project.status, ['PENDING'], 'xóa')

      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Project'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.project.delete({
        where: { id, creatorId: userId }
      })
    })
  }

  async deleteMany(data: DeleteManyProjectDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataProject: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Project'
      }

      const projects = await prisma.project.findMany({
        where: {
          id: { in: data.ids },
          creatorId: userId
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

  validateProjectStatus(
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

  async findMany(
    data: FindManyProjectDto,
    permissionCodes: string[],
    userId: string
  ) {
    let conditions: Prisma.ProjectWhereInput = {}

    const isAdmin = this.hasPermission(
      [permissions.project.approve],
      permissionCodes
    )

    if (isAdmin) {
      conditions = {}
    }

    if (!isAdmin) {
      conditions = {
        OR: [
          {
            creatorId: userId
          },
          {
            status: {
              in: [ProjectStatus.APPROVED, ProjectStatus.BUDGET_APPROVED]
            }
          }
        ]
      }
    }

    return this.findManyBase(conditions, data, projectSelect)
  }

  async findManyBase(
    conditions: Prisma.ProjectWhereInput,
    data: FindManyProjectDto,
    select: Prisma.ProjectSelect
  ) {
    const { page, perPage, keyword, orderKey, orderValue, statuses } = data

    const keySearch = ['name', 'code', 'address']

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

  async findOne(id: string, permissionCodes: string[], userId: string) {
    let conditions: Prisma.ProjectWhereInput = {}

    const isAdmin = this.hasPermission(
      [permissions.project.approve],
      permissionCodes
    )

    if (isAdmin) {
      conditions = {}
    }

    if (!isAdmin) {
      conditions = {
        OR: [
          {
            creatorId: userId
          },
          {
            status: {
              in: [ProjectStatus.APPROVED, ProjectStatus.BUDGET_APPROVED]
            }
          }
        ]
      }
    }

    return this.prisma.project.findUniqueOrThrow({
      where: {
        id,
        AND: [
          {
            ...conditions
          }
        ]
      },
      select: projectSelect
    })
  }

  hasPermission(codes: string[], permissionCodes: string[]) {
    return codes.some(code => permissionCodes.includes(code))
  }

  async approve(id: string, userId: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id
      },
      select: {
        status: true
      }
    })

    this.validateProjectStatus(project.status, ['PENDING'], 'duyệt')

    return this.prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.APPROVED,
        updaterId: userId
      }
    })
  }

  async requestEdit(id: string, userId: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id
      },
      select: {
        status: true
      }
    })

    this.validateProjectStatus(project.status, ['PENDING'], 'yêu cầu chỉnh sửa')

    return this.prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.EDIT_REQUESTED,
        updaterId: userId
      }
    })
  }
}
