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
import {
  CreateUnitDto,
  DeleteManyUnitDto,
  FindManyUnitDto,
  UpdateUnitDto
} from './dto/unit.dto'
import { UnitService } from './unit.service'
import { RequestJWT } from 'types'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { checkExistenceDto } from 'utils/common.dto'

@UseGuards(JwtAuthGuard)
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  create(@Body() data: CreateUnitDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.create(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() data: UpdateUnitDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.unitService.update(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.delete(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteMany(@Body() data: DeleteManyUnitDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.deleteMany(data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyUnitDto) {
    return this.unitService.findMany(data)
  }

  @Post('me/check-existence')
  @HttpCode(HttpStatus.OK)
  checkExistence(@Body() data: checkExistenceDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.checkExistence(data, userId)
  }
}
