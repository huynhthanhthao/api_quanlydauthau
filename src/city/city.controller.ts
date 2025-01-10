import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query
} from '@nestjs/common'
import { CityService } from './city.service'
import { FindManyCityDto } from './dto/city.dto'

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyCityDto) {
    return this.cityService.findMany(data)
  }

  @Get(':code')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('code') code: number) {
    return this.cityService.findOne(code)
  }
}
