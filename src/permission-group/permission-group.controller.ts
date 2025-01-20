import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { PermissionGroupService } from './permission-group.service'
import { FindManyPermissionGroupDto } from './dto/permission-group.dto'

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
}
