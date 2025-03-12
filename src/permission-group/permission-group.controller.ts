import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common'
import { PermissionGroupService } from './permission-group.service'
import {
  CreatePermissionGroupDto,
  FindManyPermissionGroupDto
} from './dto/permission-group.dto'

@Controller('permission-group')
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyPermissionGroupDto) {
    return this.permissionGroupService.findMany(data)
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  create(@Body() data: CreatePermissionGroupDto) {
    return this.permissionGroupService.create(data)
  }
}
