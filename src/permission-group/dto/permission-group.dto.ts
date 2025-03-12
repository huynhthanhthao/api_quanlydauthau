import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreatePermissionGroupDto {
  @IsNotEmpty()
  name: string

  permissionCodes?: string[]
}

export class UpdatePermissionGroupDto extends PartialType(
  CreatePermissionGroupDto
) {}

export class FindManyPermissionGroupDto extends FindManyDto {}

export class DeleteManyPermissionGroupDto extends DeleteManyDto {}
