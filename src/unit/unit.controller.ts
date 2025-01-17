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

@UseGuards(JwtAuthGuard)
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  createMyUnit(@Body() data: CreateUnitDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.createMyUnit(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  updateMyUnit(
    @Body() data: UpdateUnitDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.unitService.updateMyUnit(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  deleteMyUnit(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.deleteMyUnit(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteManyMyUnits(
    @Body() data: DeleteManyUnitDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.unitService.deleteManyMyUnits(data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOneMyUnit(@Param('id') id: string) {
    return this.unitService.findOneMyUnit(id)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findManyMyUnits(@Query() data: FindManyUnitDto) {
    return this.unitService.findManyMyUnits(data)
  }
}
