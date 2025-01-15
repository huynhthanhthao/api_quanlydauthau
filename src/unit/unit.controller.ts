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

  @Post('')
  @HttpCode(HttpStatus.OK)
  create(@Body() data: CreateUnitDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() data: UpdateUnitDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.unitService.update(id, data, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  deleteMany(@Body() data: DeleteManyUnitDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyUnitDto) {
    return this.unitService.findMany(data)
  }

  @Post('/check-existence')
  @HttpCode(HttpStatus.OK)
  checkExistence(@Body() data: checkExistenceDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.unitService.checkExistence(data, userId)
  }
}
