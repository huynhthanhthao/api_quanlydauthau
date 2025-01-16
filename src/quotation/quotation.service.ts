import { PrismaService } from 'nestjs-prisma'
import { PrismaClient, Prisma, QuotationStatus } from '.prisma/client'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import {
  productCaptureSelect,
  quotationDetailSelect,
  quotationSelect
} from 'responses'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
import {
  CreateQuotationDto,
  CreateQuotationItemDto,
  DeleteManyQuotationDto,
  FindManyQuotationDto,
  UpdateQuotationDto
} from './dto/quotation.dto'

@Injectable()
export class QuotationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async createMyQuotation(data: CreateQuotationDto, userId: string) {
    const items = await this.getQuotationItems(data.items)

    return this.prisma.quotation.create({
      data: {
        name: data.name,
        desc: data.desc,
        projectId: data.projectId,
        price: data.price,
        status: QuotationStatus.PENDING,
        items: {
          create: items
        },
        creatorId: userId
      },
      include: { items: true }
    })
  }

  async getQuotationItems(quotationItems: CreateQuotationItemDto[]) {
    if (!quotationItems || quotationItems.length === 0) return []

    const data = await Promise.all(
      quotationItems.map(async item => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: productCaptureSelect
        })

        if (!product)
          throw new HttpException(
            `Không tìm thấy sản phẩm với ID: ${item.productId}!`,
            HttpStatus.NOT_FOUND
          )

        return {
          productId: item.productId,
          productCapture: product,
          attachedFiles: item.attachedFiles,
          quantity: item.quantity
        }
      })
    )

    return data
  }

  async updateMyQuotations(
    id: string,
    data: UpdateQuotationDto,
    userId: string
  ) {
    const items = await this.getQuotationItems(data.items)

    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.quotationItem.deleteMany({ where: { quotationId: id } })

      return prisma.quotation.update({
        where: {
          id,
          creatorId: userId
        },
        data: {
          name: data.name,
          desc: data.desc,
          price: data.price,
          status: QuotationStatus.PENDING,
          items: { create: items },
          updaterId: userId
        },
        include: {
          items: true
        }
      })
    })
  }

  async findManyMyQuotations(data: FindManyQuotationDto, userId: string) {
    const { page, perPage, keyword, orderKey, orderValue, statuses } = data

    const keySearch = ['name', 'desc']

    const where: Prisma.QuotationWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      ...(statuses && {
        status: {
          in: statuses
        }
      }),
      creatorId: userId
    }

    return await paginate(
      this.prisma.quotation,
      {
        where,
        select: quotationSelect,
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

  async findOneMyQuotation(id: string, userId: string) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: { id, creatorId: userId },
      select: quotationDetailSelect
    })
  }

  async deleteManyMyQuotations(data: DeleteManyQuotationDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataProject: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Quotation',
        include: {
          items: true
        }
      }

      await this.trashService.createMany(dataProject, prisma)

      return prisma.quotation.deleteMany({
        where: {
          id: {
            in: data.ids
          },
          creatorId: userId
        }
      })
    })
  }

  async deleteMyQuotation(id: string, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateTrashDto = {
        id,
        userId,
        modelName: 'Quotation',
        include: {
          items: true
        }
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.quotation.delete({
        where: { id, creatorId: userId },
        include: {
          items: true
        }
      })
    })
  }
}
