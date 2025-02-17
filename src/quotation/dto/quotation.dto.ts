import { QuotationStatus } from '.prisma/client'
import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { CreateProductAttributeDto } from 'src/product/dto/product.dto'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateQuotationDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  projectId: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[]

  desc?: string

  price?: number
}

export class CreateProductQuotationto {
  @IsNotEmpty()
  name: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  productAttributes: CreateProductAttributeDto[]

  thumb?: string
  desc?: string
}

export class CreateQuotationItemDto {
  @IsNotEmpty()
  unit: string

  @IsNotEmpty()
  quantity: number

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductQuotationto)
  productQuotation: CreateProductQuotationto

  attachedFileIds?: string[]
}

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {}

export class FindManyQuotationDto extends FindManyDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((v: string) => v.trim())
  })
  @IsEnum(QuotationStatus, { each: true })
  statuses: QuotationStatus[]

  projectId?: string
}

export class DeleteManyQuotationDto extends DeleteManyDto {}
