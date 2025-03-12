import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreatePriorityDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  color: string
}

export class UpdatePriorityDto extends PartialType(CreatePriorityDto) {}

export class FindManyPriorityDto extends FindManyDto {}

export class DeleteManyPriorityDto extends DeleteManyDto {}
