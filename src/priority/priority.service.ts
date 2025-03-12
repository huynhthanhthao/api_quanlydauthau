import { Prisma, PrismaClient } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
import {
  priorityDetailSelect,
  prioritySelect
} from 'responses/priority.response'
import {
  CreatePriorityDto,
  UpdatePriorityDto,
  FindManyPriorityDto,
  DeleteManyPriorityDto
} from './dto/priority.dto'

@Injectable()
export class PriorityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreatePriorityDto, userId: string) {
    return await this.prisma.priority.create({
      data: {
        name: data.name,
        color: data.color,
        creatorId: userId
      }
    })
  }

  async update(id: string, data: UpdatePriorityDto, userId: string) {
    return await this.prisma.priority.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
        updaterId: userId
      }
    })
  }

  async findMany(data: FindManyPriorityDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'color']

    const where: Prisma.PriorityWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.priority,
      {
        where,
        select: prioritySelect,
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

  async findOne(id: string) {
    return this.prisma.priority.findUniqueOrThrow({
      where: { id },
      select: priorityDetailSelect
    })
  }

  async deleteMany(data: DeleteManyPriorityDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataUnit: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Priority'
      }

      await this.trashService.createMany(dataUnit, prisma)

      return prisma.priority.deleteMany({
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
        modelName: 'Priority'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.priority.delete({ where: { id } })
    })
  }
}
