import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import {
  CreateProductDto,
  DeleteManyProductDto,
  FindManyProductDto,
  UpdateProductDto
} from './dto/product.dto'
import { Prisma, PrismaClient } from '.prisma/client'
import { paginate } from 'utils/helper'
import { productSelect } from 'responses'
import { TrashService } from 'src/trash/trash.service'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async createMyProject(data: CreateProductDto, userId: string) {
    return await this.prisma.product.create({
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.thumb,
        producer: data.producer,
        creatorId: userId,
        categories: {
          connect: data.categoryIds.map(id => ({ id }))
        }
      }
    })
  }

  async updateMyProject(id: string, data: UpdateProductDto, userId: string) {
    return await this.prisma.product.update({
      where: { id, creatorId: userId },
      data: {
        name: data.name,
        desc: data.desc,
        thumb: data.name,
        producer: data.producer,
        updaterId: userId,
        categories: {
          set: data.categoryIds?.map(id => ({ id }))
        }
      }
    })
  }

  async findManyMyProjects(data: FindManyProductDto, userId: string) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'desc', 'producer']

    const where: Prisma.ProductWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      ...(data.categoryIds && {
        categories: {
          some: {
            id: {
              in: data.categoryIds
            }
          }
        }
      }),
      creatorId: userId
    }

    return await paginate(
      this.prisma.product,
      {
        where,
        select: productSelect,
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

  async findOneMyProject(id: string, userId: string) {
    return this.prisma.product.findUniqueOrThrow({
      where: { id, creatorId: userId },
      select: productSelect
    })
  }

  async deleteManyMyProjects(data: DeleteManyProductDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Product'
      }

      await this.trashService.createMany(dataTrash, prisma)

      return prisma.product.deleteMany({
        where: {
          id: {
            in: data.ids
          },
          creatorId: userId
        }
      })
    })
  }

  async deleteMyProject(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Product'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.product.delete({ where: { id, creatorId: userId } })
    })
  }
}
