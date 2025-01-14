import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string

  thumb?: string

  desc?: string
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class FindManyCategoryDto extends FindManyDto {}

export class DeleteManyCategoryDto extends DeleteManyDto {}
