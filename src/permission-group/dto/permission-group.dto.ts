import { PartialType } from '@nestjs/mapped-types'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreatePermissionGroupDto {}

export class UpdatePermissionGroupDto extends PartialType(
  CreatePermissionGroupDto
) {}

export class FindManyPermissionGroupDto extends FindManyDto {}

export class DeleteManyPermissionGroupDto extends DeleteManyDto {}
