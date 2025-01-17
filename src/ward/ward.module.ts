import { Module } from '@nestjs/common'
import { Prisma } from '.prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { WardService } from './ward.service'
import { WardController } from './ward.controller'
import { paginate } from 'utils/helper'
import { FindManyWardDto } from './dto/ward.dto'

@Module({
  controllers: [WardController],
  providers: [WardService]
})
export class WardModule {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(data: FindManyWardDto) {
    const { page, perPage, keyword } = data

    const keySearch = ['name', 'divisionType']

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
