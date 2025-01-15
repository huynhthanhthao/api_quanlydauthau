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

@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  create(@Body() data: CreateTicketDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.create(data, userId)
  }

  @Post('me/:ticketId/comment')
  @HttpCode(HttpStatus.OK)
  createTicketComment(
    @Body() data: CreateTicketCommentDto,
    @Req() request: RequestJWT,
    @Param('ticketId') ticketId: string
  ) {
    const { userId } = request
    return this.ticketService.createTicketComment(ticketId, data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() data: UpdateTicketDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.update(id, data, userId)
  }

  @Get('me/:ticket/comment')
  @HttpCode(HttpStatus.OK)
  findManyTicketComment(
    @Param('ticketId') ticketId: string,
    @Query() data: FindManyTicketCommentDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.ticketService.findManyTicketComment(ticketId, data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.findOne(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyTicketDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.ticketService.findMany(data, userId)
  }
}
