import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query
} from '@nestjs/common'
import { DistrictService } from './district.service'
import { FindManyDistrictDto } from './dto/district.dto'

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyDistrictDto) {
    return this.districtService.findMany(data)
  }

  @Get(':code')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('code') code: number) {
    return this.districtService.findOne(code)
  }
}
