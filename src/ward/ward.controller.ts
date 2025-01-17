import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query
} from '@nestjs/common'
import { WardService } from './ward.service'
import { FindManyWardDto } from './dto/ward.dto'

@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyWardDto) {
    return this.wardService.findMany(data)
  }

  @Get(':code')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('code') code: number) {
    return this.wardService.findOne(code)
  }
}
