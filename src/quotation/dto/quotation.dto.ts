import { QuotationStatus } from '.prisma/client'
import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

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
}

export class CreateProductQuotationDto {
  @IsNotEmpty()
  name: string

  projectItemId?: string
  thumb?: string
  desc?: string
}

export class RequestEditDto {
  @IsNotEmpty()
  isEditable: boolean
}

export class CreateQuotationItemDto {
  @IsNotEmpty()
  unit: string

  @IsNotEmpty()
  quantity: number

  @IsNotEmpty()
  projectItemId: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductQuotationDto)
  productQuotation: CreateProductQuotationDto

  attachedFileIds?: string[]

  price?: number
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

export class FindManyQuotationsInMyProjectsDto extends FindManyDto {
  projectId?: string

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((v: string) => v.trim())
  })
  @IsEnum(QuotationStatus, { each: true })
  statuses: QuotationStatus[]
}

export class DeleteManyQuotationDto extends DeleteManyDto {}
