import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateRoleDto {
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsArray()
  permissionCodes: string[]
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class FindManyRoleDto extends FindManyDto {}

export class DeleteManyRoleDto extends DeleteManyDto {}
