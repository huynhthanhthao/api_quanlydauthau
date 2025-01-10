import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import {
  CreateProductDto,
  DeleteManyProductDto,
  FindManyProductDto,
  UpdateProductDto,
} from './dto/product.dto'
import { Prisma, PrismaClient } from '.prisma/client'
import { paginate } from 'utils/helper'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto, userId: string) {
    return await this.prisma.product.create({
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.name,
        producer: data.producer,
        creatorId: userId,
        categories: {
          connect: data.categoryIds.map(id => ({ id })),
        },
      },
    })
  }

  async update(id: string, data: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.name,
        producer: data.producer,
        categories: {
          set: data.categoryIds.map(id => ({ id })),
        },
      },
    })
  }

  async findMany(data: FindManyProductDto) {
    const { page, perPage, keyword } = data

    const keySearch = ['name', 'desc', 'producer']

    const where: Prisma.ProductWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword },
        })),
      }),
    }

    return await paginate(
      this.prisma.product,
      {
        where,
        include: {
          categories: true,
        },
      },
      {
        page,
        perPage,
      }
    )
  }

  async findOne(id: string) {
    return this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        categories: true,
      },
    })
  }

  async deleteMany(data: DeleteManyProductDto) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.product.deleteMany({
        where: {
          id: {
            in: data.ids,
          },
        },
      })
    })
  }
}
