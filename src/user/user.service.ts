import * as bcrypt from 'bcrypt'
import { PrismaService } from 'nestjs-prisma'
import { Prisma, PrismaClient, UserStatus } from '.prisma/client'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { userDetailSelect, userSelect } from 'responses'
import { CreateManyTrashDto, CreateTrashDto } from 'src/trash/dto/trash.dto'
import { TrashService } from 'src/trash/trash.service'
import { paginate } from 'utils/helper'
import {
  ChangeMyPasswordDto,
  ChangePasswordDto,
  CreateUserDto,
  DeleteManyUserDto,
  FindManyUserDto,
  UpdateUserDto
} from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trashService: TrashService
  ) {}

  async create(data: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password: bcrypt.hashSync(data.password, 10),
        status: UserStatus.ACTIVE,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        wardCode: data.wardCode,
        address: data.address,
        birthDate: data.birthDate,
        companyId: data.companyId,
        roles: {
          connect: data.roleIds.map(id => ({ id }))
        }
      },
      include: {
        roles: true
      }
    })
  }

  async updateMyProfile(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        wardCode: data.wardCode,
        address: data.address,
        birthDate: data.birthDate
      },
      include: {
        roles: true
      }
    })
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        username: data.username,
        status: UserStatus.ACTIVE,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        wardCode: data.wardCode,
        address: data.address,
        birthDate: data.birthDate,
        companyId: data.companyId,
        ...(data.password && { password: bcrypt.hashSync(data.password, 10) }),
        roles: {
          set: data.roleIds?.map(id => ({ id }))
        }
      },
      include: {
        roles: true
      }
    })
  }

  async findMany(data: FindManyUserDto) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['name', 'username', 'email', 'phone', 'address']

    const where: Prisma.UserWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      })
    }

    return await paginate(
      this.prisma.user,
      {
        where,
        select: userSelect,
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
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: userDetailSelect
    })
  }

  async deleteMany(data: DeleteManyUserDto, userId: string) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const dataTrash: CreateManyTrashDto = {
        ids: data.ids,
        userId,
        modelName: 'User',
        include: { roles: true }
      }

      await this.trashService.createMany(dataTrash, prisma)

      return prisma.user.deleteMany({
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
        modelName: 'User'
      }

      await this.trashService.create(dataTrash, prisma)

      return prisma.user.delete({ where: { id }, include: { roles: true } })
    })
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: bcrypt.hashSync(data.password, 10)
      }
    })
  }

  async changeMyPassword(userId: string, data: ChangeMyPasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true }
    })

    const isValid = bcrypt.compareSync(data.oldPassword, user.password)

    if (!isValid)
      throw new HttpException('Mật khẩu cũ không đúng!', HttpStatus.CONFLICT)

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: bcrypt.hashSync(data.newPassword, 10)
      }
    })
  }
}
