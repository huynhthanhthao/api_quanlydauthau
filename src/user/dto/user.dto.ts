import { PartialType } from '@nestjs/mapped-types'
import { ArrayNotEmpty, IsNotEmpty, IsPhoneNumber, Min } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string

  @ArrayNotEmpty()
  roleIds: string[]

  @IsNotEmpty()
  companyId: string

  @IsPhoneNumber('VN')
  phone?: string

  birthDate?: Date
  email?: string
  avatar?: string
  wardCode?: number
  address?: string
}

export class ChangePasswordDto {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  @Min(6)
  password: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FindManyUserDto extends FindManyDto {}

export class DeleteManyUserDto extends DeleteManyDto {}
