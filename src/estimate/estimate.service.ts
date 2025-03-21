import {
  EstimateStatus,
  Prisma,
  PrismaClient,
  ProjectStatus
} from '.prisma/client'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { hasPermission, normalizeDate, paginate } from 'utils/helper'
import {
  CreateEstimateDto,
  UpdateEstimateDto,
  FindManyEstimateDto,
  DeleteManyEstimateDto
} from './dto/estimate.dto'
import {
  estimateDetailSelect,
  estimateSelect
} from 'responses/estimate.response'
import { permissions } from 'enums'

@Injectable()
export class EstimateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateEstimateDto, userId: string) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id: data.projectId }
    })

    if (normalizeDate(project.estDeadline) < normalizeDate(new Date()))
      throw new HttpException(`Đã quá hạn gửi dự toán!`, HttpStatus.CONFLICT)

    return await this.prisma.estimate.create({
      data: {
        name: data.name,
        projectId: data.projectId,
        status: EstimateStatus.PENDING,
        productEstimates: {
          create: data.productEstimates.map(product => ({
            name: product.name,
            desc: product.desc
          }))
        },
        creatorId: userId
      },
      select: estimateSelect
    })
  }

  async update(id: string, data: UpdateEstimateDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const estimate = await prisma.estimate.findUniqueOrThrow({
        where: { id }
      })

      this.validateEstimateStatus(
        estimate.status,
        ['EDIT_REQUESTED'],
        'cập nhật'
      )

      if (data.productEstimates)
        await prisma.productEstimate.deleteMany({ where: { estimateId: id } })

      return await prisma.estimate.update({
        where: { id, creatorId: userId },
        data: {
          name: data.name,
          productEstimates: {
            create: data.productEstimates?.map(product => ({
              name: product.name,
              desc: product.desc
            }))
          },
          updaterId: userId,
          status: EstimateStatus.PENDING
        },
        select: estimateSelect
      })
    })
  }

  async findMany(
    data: FindManyEstimateDto,
    permissionCodes: string[],
    userId: string
  ) {
    const { page, perPage, orderKey, orderValue, keyword, projectId } = data

    const keySearch = ['name']

    let conditions: Prisma.EstimateWhereInput = {}

    const isAdmin = hasPermission(
      [
        permissions.estimate.approve,
        permissions.estimate.cancel,
        permissions.estimate.requestEdit
      ],
      permissionCodes
    )

    if (isAdmin) {
      conditions = {}
    }

    if (!isAdmin) {
      conditions = {
        creatorId: userId
      }
    }

    const where: Prisma.EstimateWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      ...(projectId && {
        projectId
      }),
      ...conditions
    }

    return await paginate(
      this.prisma.estimate,
      {
        where,
        orderBy: {
          [orderKey]: orderValue
        },
        select: estimateSelect
      },
      {
        page,
        perPage
      }
    )
  }

  async findOne(id: string, permissionCodes: string[], userId: string) {
    let conditions = {}

    const isAdmin = hasPermission(
      [
        permissions.estimate.approve,
        permissions.estimate.cancel,
        permissions.estimate.requestEdit
      ],
      permissionCodes
    )

    if (isAdmin) {
      conditions = {}
    }

    if (!isAdmin) {
      conditions = {
        creatorId: userId
      }
    }
    return this.prisma.estimate.findUniqueOrThrow({
      where: { id, ...conditions },
      select: estimateDetailSelect
    })
  }

  async deleteMany(data: DeleteManyEstimateDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataUnit: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Estimate'
      }

      const estimates = await prisma.estimate.findMany({
        where: {
          id: { in: data.ids },
          creatorId: userId
        }
      })

      estimates.forEach(estimate =>
        this.validateEstimateStatus(estimate.status, ['PENDING'], 'xóa')
      )

      await this.trashService.createMany(dataUnit, prisma)

      return prisma.estimate.deleteMany({
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
      const estimate = await prisma.estimate.findUniqueOrThrow({
        where: { id }
      })

      this.validateEstimateStatus(estimate.status, ['PENDING'], 'xóa')

      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Estimate',
        include: {
          productEstimates: true
        }
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.estimate.delete({
        where: { id, creatorId: userId },
        select: estimateSelect
      })
    })
  }

  async approve(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const estimate = await prisma.estimate.findUniqueOrThrow({
        where: { id },
        include: {
          project: true
        }
      })

      this.validateEstimateStatus(estimate.status, ['PENDING'], 'duyệt')

      this.validateProjectStatus(
        estimate.project.status,
        ['APPROVED'],
        'Không thể duyệt dự toán của dự án này!'
      )

      // Hủy dự toán đã duyệt trước đó
      await prisma.estimate.updateMany({
        where: {
          projectId: estimate.projectId,
          status: EstimateStatus.APPROVED
        },
        data: {
          status: EstimateStatus.CANCELED
        }
      })

      // Cập nhật trạng thái dự án -> Đã duyệt dự toán
      await prisma.project.update({
        where: { id: estimate.projectId },
        data: { status: ProjectStatus.BUDGET_APPROVED }
      })

      return prisma.estimate.update({
        where: { id },
        data: {
          status: EstimateStatus.APPROVED,
          updaterId: userId
        },
        select: estimateSelect
      })
    })
  }

  async cancel(id: string, userId: string) {
    const estimate = await this.prisma.estimate.findUniqueOrThrow({
      where: { id }
    })

    this.validateEstimateStatus(estimate.status, ['PENDING'], 'hủy')

    return this.prisma.estimate.update({
      where: { id },
      data: {
        status: EstimateStatus.CANCELED,
        updaterId: userId
      },
      select: estimateSelect
    })
  }

  async requestEdit(id: string, userId: string) {
    const estimate = await this.prisma.estimate.findUniqueOrThrow({
      where: { id }
    })

    this.validateEstimateStatus(
      estimate.status,
      ['PENDING'],
      'yêu cầu điều chỉnh'
    )

    return this.prisma.estimate.update({
      where: { id },
      data: {
        status: EstimateStatus.EDIT_REQUESTED,
        updaterId: userId
      },
      select: estimateSelect
    })
  }

  validateEstimateStatus(
    status: EstimateStatus,
    validStatuses: EstimateStatus[],
    action: string
  ) {
    if (!validStatuses.includes(status)) {
      throw new HttpException(
        `Không thể ${action} dự toán ở trạng thái này.`,
        HttpStatus.CONFLICT
      )
    }
  }

  validateProjectStatus(
    status: ProjectStatus,
    validStatuses: ProjectStatus[],
    message: string
  ) {
    if (!validStatuses.includes(status)) {
      throw new HttpException(message, HttpStatus.CONFLICT)
    }
  }
}
