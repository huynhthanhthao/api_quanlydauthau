import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateProductDto {
  @IsNotEmpty()
  name: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  productAttributes?: CreateProductAttributeDto[]

  desc?: string

  thumb?: string

  producer?: string
}

export class CreateProductAttributeDto {
  @IsNotEmpty()
  key: string

  @IsNotEmpty()
  value: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FindManyProductDto extends FindManyDto {
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  categoryIds?: string[]
}

export class DeleteManyProductDto extends DeleteManyDto {}
