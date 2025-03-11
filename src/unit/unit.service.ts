import { Prisma, PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  CreateUnitDto,
  DeleteManyUnitDto,
  FindManyUnitDto,
  UpdateUnitDto
} from './dto/unit.dto'
import { PrismaService } from 'nestjs-prisma'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { checkExistenceDto } from 'utils/common.dto'

@Injectable()
export class UnitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async createMyUnit(data: CreateUnitDto, userId: string) {
    return await this.prisma.unit.create({
      data: {
        name: data.name,
        desc: data.desc,
        code: data.code,
        creatorId: userId
      }
    })
  }

  async updateMyUnit(id: string, data: UpdateUnitDto, userId: string) {
    return await this.prisma.unit.update({
      where: { id },
      data: {
        name: data.name,
        desc: data.desc,
        code: data.code,
        updaterId: userId
      }
    })
  }

  async findManyMyUnits(data: FindManyUnitDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'desc', 'code']

    const where: Prisma.UnitWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.unit,
      {
        where,
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

  async findOneMyUnit(id: string) {
    return this.prisma.unit.findUniqueOrThrow({
      where: { id }
    })
  }

  async deleteManyMyUnits(data: DeleteManyUnitDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataUnit: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Unit'
      }

      await this.trashService.createMany(dataUnit, prisma)

      return prisma.unit.deleteMany({
        where: {
          id: {
            in: data.ids
          }
        }
      })
    })
  }

  async deleteMyUnit(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Unit'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.unit.delete({ where: { id } })
    })
  }

  async checkExistence(data: checkExistenceDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        [data.key]: data.value
      }
    })

    return user ? true : false
  }
}
