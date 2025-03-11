import { Injectable } from '@nestjs/common'
import { Prisma } from '.prisma/client'
import { paginate } from 'utils/helper'
import { PrismaService } from 'nestjs-prisma'
import { permissionGroupSelect } from 'responses'
import {
  CreatePermissionGroupDto,
  FindManyPermissionGroupDto
} from './dto/permission-group.dto'

@Injectable()
export class PermissionGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(data: FindManyPermissionGroupDto) {
    const { page, perPage } = data

    const where: Prisma.PermissionGroupWhereInput = {
      parentId: null
    }

    return await paginate(
      this.prisma.permissionGroup,
      {
        where,
        select: permissionGroupSelect
      },
      {
        page,
        perPage
      }
    )
  }

  async create(data: CreatePermissionGroupDto) {
    return await this.prisma.permissionGroup.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissionCodes.map(code => ({ code }))
        }
      }
    })
  }
}
