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
  @Roles(permissions.estimate.create)
  create(@Body() data: CreateEstimateDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.estimate.update)
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
  @Roles(permissions.estimate.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.estimate.delete)
  deleteMany(@Body() data: DeleteManyEstimateDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.estimate))
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request

    return this.estimateService.findOne(id, userId)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.estimate))
  findMany(@Query() data: FindManyEstimateDto, @Req() request: RequestJWT) {
    const { userId, role } = request

    const permissionCodes =
      role.permissions.map(permission => permission.code) || []

    return this.estimateService.findMany(data, permissionCodes, userId)
  }

  /*  Dành cho admin */

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.estimate.approve)
  approve(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.approve(id, userId)
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.estimate.cancel)
  cancel(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.cancel(id, userId)
  }

  @Patch(':id/request-edit')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.estimate.requestEdit)
  requestEdit(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.estimateService.requestEdit(id, userId)
  }
}
