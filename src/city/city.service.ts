import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyCityDto } from './dto/city.dto'
import { PrismaService } from 'nestjs-prisma'
import { paginate } from 'utils/helper'

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(data: FindManyCityDto) {
    const { page, perPage, keyword } = data

    const keySearch = ['name', 'divisionType']

    const where: Prisma.UserWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword },
        })),
      }),
    }

    return await paginate(
      this.prisma.city,
      {
        where,
      },
      {
        page,
        perPage,
      }
    )
  }

  async findOne(code: number) {
    return this.prisma.city.findUniqueOrThrow({
      where: { code },
      include: { districts: true },
    })
  }
}
