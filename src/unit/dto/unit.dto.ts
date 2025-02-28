import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreateUnitDto {
  @IsNotEmpty()
  name: string

  code?: string

  desc?: string
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}

export class FindManyUnitDto extends FindManyDto {}

export class DeleteManyUnitDto extends DeleteManyDto {}
