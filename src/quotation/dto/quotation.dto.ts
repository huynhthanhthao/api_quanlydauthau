import { QuotationStatus } from '.prisma/client'
import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateQuotationDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  projectId: string

  desc?: string

  price?: number

  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items?: CreateQuotationItemDto[]
}

export class CreateQuotationItemDto {
  @IsNotEmpty()
  productId: string

  @IsNotEmpty()
  quantity: number

  attachedFiles?: string[]

  @IsNotEmpty()
  unit: string
}

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {}

export class FindManyQuotationDto extends FindManyDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((v: string) => v.trim())
  })
  @IsEnum(QuotationStatus, { each: true })
  statuses?: QuotationStatus[]
}

export class DeleteManyQuotationDto extends DeleteManyDto {}
