import { Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { paginate } from 'utils/helper'
import { FindManyWardDto } from './dto/ward.dto'

@Injectable()
export class WardService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(data: FindManyWardDto) {
    const { page, perPage, keyword } = data

    const keySearch = ['name', 'divisionType', 'shortCodeName']

    const where: Prisma.WardWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.ward,
      {
        where
      },
      {
        page,
        perPage
      }
    )
  }

  async findOne(code: number) {
    return this.prisma.ward.findUniqueOrThrow({
      where: { code }
    })
  }
}
