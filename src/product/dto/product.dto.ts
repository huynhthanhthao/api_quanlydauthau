import { PartialType } from '@nestjs/mapped-types'
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateProductDto {
  @IsNotEmpty()
  name: string

  @ArrayNotEmpty()
  categoryIds: string[]

  desc?: string

  thumb?: string

  producer?: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FindManyProductDto extends FindManyDto {
  categoryIds?: string[]
}

export class DeleteManyProductDto extends DeleteManyDto {}
