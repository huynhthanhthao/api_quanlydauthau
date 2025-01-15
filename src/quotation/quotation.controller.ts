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
  create(@Body() data: CreateQuotationDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.create(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() data: UpdateQuotationDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.update(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.delete(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteMany(@Body() data: DeleteManyQuotationDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.deleteMany(data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.findOne(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyQuotationDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.findMany(data, userId)
  }
}
