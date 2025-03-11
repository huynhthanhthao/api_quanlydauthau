import { Prisma, PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
import {
  CreateRoleDto,
  UpdateRoleDto,
  FindManyRoleDto,
  DeleteManyRoleDto
} from './dto/role.dto'
import { roleSelect } from 'responses/role.response'

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateRoleDto) {
    return await this.prisma.role.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissionCodes?.map(code => ({ code }))
        }
      },
      include: {
        permissions: true
      }
    })
  }

  async update(id: string, data: UpdateRoleDto) {
    return await this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        permissions: {
          set: data.permissionCodes?.map(code => ({ code }))
        }
      },
      include: {
        permissions: true
      }
    })
  }

  async findMany(data: FindManyRoleDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name']

    const where: Prisma.RoleWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.role,
      {
        where,
        orderBy: {
          [orderKey]: orderValue
        },
        select: roleSelect
      },
      {
        page,
        perPage
      }
    )
  }

  async findOne(id: string) {
    return this.prisma.role.findUniqueOrThrow({
      where: { id },
      select: roleSelect
    })
  }

  async deleteMany(data: DeleteManyRoleDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'Role',
        include: {
          permissions: true
        }
      }

      await this.trashService.createMany(dataTrash, prisma)

      return prisma.role.deleteMany({
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
        modelName: 'Role',
        include: {
          permissions: true
        }
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.role.delete({ where: { id } })
    })
  }
}
