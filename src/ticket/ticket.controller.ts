import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { TicketService } from './ticket.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RequestJWT } from 'types'
import {
  CreateTicketCommentDto,
  CreateTicketDto,
  FindManyTicketCommentDto,
  FindManyTicketDto,
  UpdateTicketDto
} from './dto/ticket.dto'
import { RolesGuard } from 'guards/role.guard'
import { permissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.ticket.send)
  create(@Body() data: CreateTicketDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.create(data, userId)
  }

  @Post(':ticketId/comment')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.ticket.send)
  createComment(
    @Body() data: CreateTicketCommentDto,
    @Req() request: RequestJWT,
    @Param('ticketId') ticketId: string
  ) {
    const { userId } = request
    return this.ticketService.createComment(ticketId, data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.ticket.updateStatus)
  update(
    @Body() data: UpdateTicketDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.update(id, data, userId)
  }

  @Get(':ticketId/comment')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.ticket))
  findManyMyTicketComments(
    @Param('ticketId') ticketId: string,
    @Query() data: FindManyTicketCommentDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.findManyMyTicketComments(ticketId, data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.ticket))
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.findOne(id, userId)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.ticket))
  findMany(@Query() data: FindManyTicketDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.findMany(data, userId)
  }
}
