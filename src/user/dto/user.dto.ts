import { UserStatus } from '@prisma/client'
import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import {
  DeleteManyDto,
  FindManyDto,
  IsVietnamesePhoneNumber
} from 'utils/common.dto'

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  companyId: string

  @IsOptional()
  @IsVietnamesePhoneNumber()
  phone?: string

  status?: UserStatus
  roleId?: string
  birthDate?: Date
  email?: string
  avatar?: string
  wardCode?: number
  address?: string
}

export class ChangeMyPasswordDto {
  @IsNotEmpty()
  oldPassword: string

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  password: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FindManyUserDto extends FindManyDto {}

export class DeleteManyUserDto extends DeleteManyDto {}
