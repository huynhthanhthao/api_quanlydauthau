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
import { ProjectService } from './project.service'
import {
  CreateProjectDto,
  DeleteManyProjectDto,
  FindManyProjectDto,
  UpdateProjectDto
} from './dto/project.dto'
import { RequestJWT } from 'types'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RolesGuard } from 'guards/role.guard'
import { Roles } from 'guards/roles.decorator'
import { permissions } from 'enums'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.create)
  create(@Body() data: CreateProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.update)
  update(
    @Body() data: UpdateProjectDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.update(id, data, userId)
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.approve)
  approve(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.approve(id, userId)
  }

  @Patch(':id/request-edit')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.requestEdit)
  requestEdit(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.requestEdit(id, userId)
  }

  @Patch(':id/request-edit')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.cancel)
  cancel(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.cancel(id, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.project.delete)
  deleteMany(@Body() data: DeleteManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteMany(data, userId)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.project))
  findMany(@Query() data: FindManyProjectDto, @Req() request: RequestJWT) {
    const { userId, role } = request

    const permissionCodes =
      role.permissions.map(permission => permission.code) || []

    return this.projectService.findMany(data, permissionCodes, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.project))
  findOneByMe(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId, role } = request

    const permissionCodes =
      role.permissions.map(permission => permission.code) || []

    return this.projectService.findOne(id, permissionCodes, userId)
  }
}
