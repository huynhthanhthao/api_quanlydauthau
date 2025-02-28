import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreatePermissionDto {}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

export class FindManyPermissionDto extends FindManyDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((v: string) => v.trim())
  })
  permissionGroupIds?: string[]
}

export class DeleteManyPermissionDto extends DeleteManyDto {}
