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

@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateQuotationDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(
    @Body() data: UpdateQuotationDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.update(id, data, userId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body() data: DeleteManyQuotationDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.deleteMany(data, userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.findOne(id, userId)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyQuotationDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.findMany(data, userId)
  }
}
