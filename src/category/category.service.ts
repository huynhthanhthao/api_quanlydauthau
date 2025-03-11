import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import {
  CreateCategoryDto,
  DeleteManyCategoryDto,
  FindManyCategoryDto,
  UpdateCategoryDto
} from './dto/category.dto'
import { TrashService } from 'src/trash/trash.service'

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateCategoryDto, userId: string) {
    // return await this.prisma.category.create({
    //   data: {
    //     name: data.name,
    //     desc: data.desc,
    //     thumb: data.thumb,
    //     creatorId: userId
    //   }
    // })
  }

  async update(id: string, data: UpdateCategoryDto, userId: string) {
    // return await this.prisma.category.update({
    //   where: { id },
    //   data: {
    //     name: data.name,
    //     desc: data.desc,
    //     thumb: data.thumb,
    //     updaterId: userId
    //   }
    // })
  }

  async findMany(data: FindManyCategoryDto) {
    // const { page, perPage, keyword, orderKey, orderValue } = data
    // const keySearch = ['name', 'desc']
    // const where: Prisma.CategoryWhereInput = {
    //   ...(keyword && {
    //     OR: keySearch.map(key => ({
    //       [key]: { contains: keyword }
    //     }))
    //   })
    // }
    // return await paginate(
    //   this.prisma.category,
    //   {
    //     where,
    //     select: categorySelect,
    //     orderBy: {
    //       [orderKey]: orderValue
    //     }
    //   },
    //   {
    //     page,
    //     perPage
    //   }
    // )
  }

  async findOne(id: string) {
    // return this.prisma.category.findUniqueOrThrow({
    //   where: { id },
    //   select: categorySelect
    // })
  }

  async deleteMany(data: DeleteManyCategoryDto, userId: string) {
    // return await this.prisma.$transaction(async (prisma: PrismaClient) => {
    //   const dataTrash: CreateManyTrashDto = {
    //     ids: data.ids,
    //     userId,
    //     modelName: 'Category'
    //   }
    //   await this.trashService.createMany(dataTrash, prisma)
    //   return prisma.category.deleteMany({
    //     where: {
    //       id: {
    //         in: data.ids
    //       }
    //     }
    //   })
    // })
  }

  async delete(id: string, userId: string) {
    // return await this.prisma.$transaction(async (prisma: PrismaClient) => {
    //   const dataTrash: CreateTrashDto = {
    //     id,
    //     userId,
    //     modelName: 'Category'
    //   }
    //   await this.trashService.create(dataTrash, prisma)
    //   return prisma.category.delete({ where: { id } })
    // })
  }
}
