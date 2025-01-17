import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  email?: string

  @IsPhoneNumber('VN')
  phone?: string

  address?: string
  wardCode?: number
  tax?: string
  website?: string
  logo?: string
  representativeName?: string
  representativePosition?: string
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

export class FindManyCompanyDto extends FindManyDto {}

export class DeleteManyCompanyDto extends DeleteManyDto {}
