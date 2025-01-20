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
import { RoleService } from './role.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RequestJWT } from 'types'
import {
  CreateRoleDto,
  UpdateRoleDto,
  DeleteManyRoleDto,
  FindManyRoleDto
} from './dto/role.dto'
import { RolesGuard } from 'guards/role.guard'
import { adminPermissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.role.create)
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.role.update)
  update(@Body() data: UpdateRoleDto, @Param('id') id: string) {
    return this.roleService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.role.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.roleService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.role.delete)
  deleteMany(@Body() data: DeleteManyRoleDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.roleService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(adminPermissions.role))
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(adminPermissions.role))
  findMany(@Query() data: FindManyRoleDto) {
    return this.roleService.findMany(data)
  }
}
