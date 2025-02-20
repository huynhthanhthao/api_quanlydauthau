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
import { userPermissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.ticket.send)
  createMyTicket(@Body() data: CreateTicketDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.createMyTicket(data, userId)
  }

  @Post('me/:ticketId/comment')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.ticket.send)
  createMyTicketComment(
    @Body() data: CreateTicketCommentDto,
    @Req() request: RequestJWT,
    @Param('ticketId') ticketId: string
  ) {
    const { userId } = request
    return this.ticketService.createMyTicketComment(ticketId, data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.ticket.updateStatus)
  updateMyTicket(
    @Body() data: UpdateTicketDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.updateMyTicket(id, data, userId)
  }

  @Get('me/:ticketId/comment')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.ticket))
  findManyMyTicketComments(
    @Param('ticketId') ticketId: string,
    @Query() data: FindManyTicketCommentDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.findManyMyTicketComments(ticketId, data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.ticket))
  findOneMyTicket(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.findOneMyTicket(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.ticket))
  findManyMyTickets(
    @Query() data: FindManyTicketDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.findManyMyTickets(data, userId)
  }
}
