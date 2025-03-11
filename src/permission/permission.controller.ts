import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query
} from '@nestjs/common'
import { PermissionService } from './permission.service'
import {
  CreatePermissionDto,
  FindManyPermissionDto
} from './dto/permission.dto'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyPermissionDto) {
    return this.permissionService.findMany(data)
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  create(@Body() data: CreatePermissionDto) {
    return this.permissionService.create(data)
  }
}
