import { Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { FindManyPermissionDto } from './dto/permission.dto'
import { paginate } from 'utils/helper'

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(data: FindManyPermissionDto) {
    const { page, perPage, permissionGroupIds } = data

    const where: Prisma.PermissionWhereInput = {
      ...(permissionGroupIds && {
        permissionGroupId: {
          in: permissionGroupIds
        }
      })
    }

    return await paginate(
      this.prisma.permission,
      {
        where
      },
      {
        page,
        perPage
      }
    )
  }
}
