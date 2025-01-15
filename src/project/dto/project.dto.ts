import { ProjectStatus } from '.prisma/client'
import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidateNested
} from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateProjectDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  price: number

  @ValidateNested({ each: true })
  @Type(() => CreateProjectItemDto)
  projectItems?: CreateProjectItemDto[]

  @IsEnum(ProjectStatus)
  status?: ProjectStatus

  address?: string

  desc?: string
}

export class CreateProjectItemDto {
  @IsNotEmpty()
  productId: string

  @IsNotEmpty()
  @Min(0)
  quantity: number
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class FindManyProjectDto extends FindManyDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((v: string) => v.trim())
  })
  @IsEnum(ProjectStatus, { each: true })
  statuses?: ProjectStatus[]
}

export class FindManyQuotationDto extends FindManyDto {}

export class DeleteManyProjectDto extends DeleteManyDto {}
