import { EstimateStatus, Prisma, PrismaClient } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
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

@Injectable()
export class EstimateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateEstimateDto, userId: string) {
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
          updaterId: userId
        },
        select: estimateSelect
      })
    })
  }

  async findMany(data: FindManyEstimateDto) {
    const { page, perPage, orderKey, orderValue, keyword } = data

    const keySearch = ['name']

    const where: Prisma.EstimateWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
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

  async findOne(id: string, userId: string) {
    return this.prisma.estimate.findUniqueOrThrow({
      where: { id, creatorId: userId },
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

      await this.trashService.createMany(dataUnit, prisma)

      return prisma.estimate.deleteMany({
        where: {
          id: {
            in: data.ids
          }
        }
      })
    })
  }

  async delete(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Estimate'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.estimate.delete({ where: { id }, select: estimateSelect })
    })
  }
}
