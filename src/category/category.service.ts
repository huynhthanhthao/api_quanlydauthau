import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import {
  CreateCategoryDto,
  DeleteManyCategoryDto,
  FindManyCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto'
import { Prisma, PrismaClient } from '.prisma/client'
import { paginate } from 'utils/helper'
import { CATEGORY_SELECT } from 'responses'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto, userId: string) {
    return await this.prisma.category.create({
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.thumb,
        parentId: data.parentId,
        creatorId: userId,
      },
    })
  }

  async update(id: string, data: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.thumb,
        parentId: data.parentId,
      },
    })
  }

  async findMany(data: FindManyCategoryDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'desc']

    const where: Prisma.CategoryWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword },
        })),
      }),
    }

    return await paginate(
      this.prisma.category,
      {
        where,
        select: CATEGORY_SELECT,
        orderBy: {
          [orderKey]: orderValue,
        },
      },
      {
        page,
        perPage,
      }
    )
  }

  async findOne(id: string) {
    return this.prisma.category.findUniqueOrThrow({
      where: { id },
      select: CATEGORY_SELECT,
    })
  }

  async deleteMany(data: DeleteManyCategoryDto) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      return await prisma.category.deleteMany({
        where: {
          id: {
            in: data.ids,
          },
        },
      })
    })
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } })
  }
}
