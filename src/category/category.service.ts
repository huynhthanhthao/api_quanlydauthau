import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import {
  CreateCategoryDto,
  DeleteManyCategoryDto,
  FindManyCategoryDto,
  UpdateCategoryDto
} from './dto/category.dto'
import { Prisma, PrismaClient } from '.prisma/client'
import { paginate } from 'utils/helper'
import { categorySelect } from 'responses'
import { TrashService } from 'src/trash/trash.service'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateCategoryDto, userId: string) {
    return await this.prisma.category.create({
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.thumb,
        parentId: data.parentId,
        creatorId: userId
      }
    })
  }

  async update(id: string, data: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.thumb,
        parentId: data.parentId
      }
    })
  }

  async findMany(data: FindManyCategoryDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'desc']

    const where: Prisma.CategoryWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.category,
      {
        where,
        select: categorySelect,
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
    return this.prisma.category.findUniqueOrThrow({
      where: { id },
      select: categorySelect
    })
  }

  async deleteMany(data: DeleteManyCategoryDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Category'
      }

      await this.trashService.createMany(dataTrash, prisma)

      return prisma.category.deleteMany({
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
        modelName: 'Category'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.category.delete({ where: { id } })
    })
  }
}
