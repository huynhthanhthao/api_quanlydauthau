import { TicketStatus, TicketType } from '.prisma/client'

import { PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { DeleteManyDto, FindManyDto } from 'utils/Common.dto'

export class CreateTicketDto {
  @IsNotEmpty()
  @IsEnum(TicketType)
  type: TicketType

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  assigneeId: string

  @IsNotEmpty()
  projectId: string
}

export class CreateTicketCommentDto {
  @IsNotEmpty()
  content: string
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsEnum(TicketStatus)
  status: TicketStatus
}

export class FindManyTicketDto extends FindManyDto {}

export class FindManyTicketCommentDto extends FindManyDto {
  orderKey?: string = 'createdAt'
  orderValue?: string = 'asc'
}

export class DeleteManyTicketDto extends DeleteManyDto {}
