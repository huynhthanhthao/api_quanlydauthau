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
import { EstimateService } from './estimate.service'
import { permissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { RequestJWT } from 'types'
import { extractPermissions } from 'utils/helper'
import {
  CreateEstimateDto,
  UpdateEstimateDto,
  DeleteManyEstimateDto,
  FindManyEstimateDto
} from './dto/estimate.dto'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RolesGuard } from 'guards/role.guard'

@Controller('estimate')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.create)
  create(@Body() data: CreateEstimateDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.update)
  update(
    @Body() data: UpdateEstimateDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.estimateService.update(id, data, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.delete)
  deleteMany(@Body() data: DeleteManyEstimateDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.company))
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request

    return this.estimateService.findOne(id, userId)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.company))
  findMany(@Query() data: FindManyEstimateDto) {
    return this.estimateService.findMany(data)
  }
}
