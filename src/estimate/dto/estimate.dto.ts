import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested, IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreateEstimateDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  projectId: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductEstimateDto)
  productEstimates: CreateProductEstimateDto[]
}

export class CreateProductEstimateDto {
  @IsNotEmpty()
  name: string

  desc?: string
}

export class UpdateEstimateDto extends PartialType(CreateEstimateDto) {}

export class FindManyEstimateDto extends FindManyDto {
  projectId?: string
}

export class DeleteManyEstimateDto extends DeleteManyDto {}
