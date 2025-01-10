import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { paginate } from 'utils/helper'
import { FindManyDistrictDto } from './dto/district.dto'

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(data: FindManyDistrictDto) {
    const { page, perPage, keyword } = data

    const keySearch = ['name', 'divisionType', 'shortCodeName']

    const where: Prisma.DistrictWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.district,
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
    return this.prisma.district.findUniqueOrThrow({
      where: { code },
      include: { wards: true }
    })
  }
}
