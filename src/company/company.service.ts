import { Prisma, PrismaClient } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { companyDetailSelect, companySelect } from 'responses'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import {} from 'src/unit/dto/unit.dto'
import { paginate } from 'utils/helper'
import {
  CreateCompanyDto,
  DeleteManyCompanyDto,
  FindManyCompanyDto,
  UpdateCompanyDto
} from './dto/company.dto'

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateCompanyDto, userId: string) {
    return await this.prisma.company.create({
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        tax: data.tax,
        website: data.website,
        logo: data.logo,
        representativeName: data.representativeName,
        representativePosition: data.representativePosition,
        wardCode: data.wardCode,
        creatorId: userId
      }
    })
  }

  async update(id: string, data: UpdateCompanyDto, userId: string) {
    return await this.prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        tax: data.tax,
        website: data.website,
        logo: data.logo,
        representativeName: data.representativeName,
        representativePosition: data.representativePosition,
        updaterId: userId
      }
    })
  }

  async findMany(data: FindManyCompanyDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = [
      'name',
      'address',
      'email',
      'phone',
      'tax',
      'website',
      'representativeName',
      'representativePosition'
    ]

    const where: Prisma.CompanyWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.company,
      {
        where,
        select: companySelect,
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
    return this.prisma.company.findUniqueOrThrow({
      where: { id },
      select: companyDetailSelect
    })
  }

  async deleteMany(data: DeleteManyCompanyDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataUnit: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Company'
      }

      await this.trashService.createMany(dataUnit, prisma)

      return prisma.company.deleteMany({
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
        modelName: 'Company'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.company.delete({ where: { id } })
    })
  }
}
