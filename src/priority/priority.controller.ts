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
import { PriorityService } from './priority.service'
import { permissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { RequestJWT } from 'types'
import { extractPermissions } from 'utils/helper'
import {
  CreatePriorityDto,
  UpdatePriorityDto,
  DeleteManyPriorityDto,
  FindManyPriorityDto
} from './dto/priority.dto'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RolesGuard } from 'guards/role.guard'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('priority')
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.priority.create)
  create(@Body() data: CreatePriorityDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.priorityService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.priority.update)
  update(
    @Body() data: UpdatePriorityDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.priorityService.update(id, data, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.priority.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.priorityService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.priority.delete)
  deleteMany(@Body() data: DeleteManyPriorityDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.priorityService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.priority))
  findOne(@Param('id') id: string) {
    return this.priorityService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.priority))
  findMany(@Query() data: FindManyPriorityDto) {
    return this.priorityService.findMany(data)
  }
}
