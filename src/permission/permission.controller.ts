import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { FindManyPermissionDto } from './dto/permission.dto'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyPermissionDto) {
    return this.permissionService.findMany(data)
  }
}
