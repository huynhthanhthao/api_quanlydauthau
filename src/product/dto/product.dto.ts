import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreateProductDto {
  @IsNotEmpty()
  name: string

  desc?: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FindManyProductDto extends FindManyDto {}

export class DeleteManyProductDto extends DeleteManyDto {}
