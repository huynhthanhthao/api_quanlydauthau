import { ProjectStatus } from '.prisma/client'
import { PartialType } from '@nestjs/mapped-types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class CreateProjectDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  investorId: string

  @IsNotEmpty()
  inviterId: string

  estDeadline?: Date

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus

  priorityId?: string
  address?: string
  estimatorIds?: string[]
}

export class ApproveProjectDto {
  @IsOptional()
  userIds: string[]
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class UpdateIsEditableDto {
  @IsNotEmpty()
  isEditable: boolean
}

export class FindManyProjectDto extends FindManyDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((v: string) => v.trim())
  })
  @IsEnum(ProjectStatus, { each: true })
  statuses?: ProjectStatus[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value === 'true')
  @IsBoolean()
  isMyProjects?: boolean
}

export class FindManyQuotationDto extends FindManyDto {}

export class DeleteManyProjectDto extends DeleteManyDto {}
