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
import { unitSelect } from 'responses'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { checkExistenceDto } from 'utils/common.dto'

@Injectable()
export class UnitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateUnitDto, userId: string) {
    return await this.prisma.unit.create({
      data: {
        name: data.name,
        desc: data.desc,
        code: data.code,
        creatorId: userId
      }
    })
  }

  async update(id: string, data: UpdateUnitDto, userId: string) {
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

  async findMany(data: FindManyUnitDto) {
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
        select: unitSelect,
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
    return this.prisma.unit.findUniqueOrThrow({
      where: { id },
      select: unitSelect
    })
  }

  async deleteMany(data: DeleteManyUnitDto, userId: string) {
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

  async delete(id: string, userId: string) {
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

  async checkExistence(data: checkExistenceDto, userId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: {
        creatorId: userId,
        [data.key]: data.value
      }
    })

    return unit ? false : true
  }
}
