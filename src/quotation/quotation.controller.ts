import {
  Body,
  Controller,
  Delete,
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
import { QuotationService } from './quotation.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'

import { RequestJWT } from 'types'
import {
  CreateQuotationDto,
  UpdateQuotationDto,
  DeleteManyQuotationDto,
  FindManyQuotationDto
} from './dto/quotation.dto'

@UseGuards(JwtAuthGuard)
@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  createMyQuotation(
    @Body() data: CreateQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.createMyQuotation(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  updateMyQuotations(
    @Body() data: UpdateQuotationDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.updateMyQuotations(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  deleteMyQuotation(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.deleteMyQuotation(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteManyMyQuotations(
    @Body() data: DeleteManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.deleteManyMyQuotations(data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOneMyQuotation(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.findOneMyQuotation(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findManyMyQuotations(
    @Query() data: FindManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.findManyMyQuotations(data, userId)
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  approveQuote(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.approveQuote(id, userId)
  }
}
