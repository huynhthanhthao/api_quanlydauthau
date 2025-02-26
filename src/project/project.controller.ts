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
  FindManyQuotationDto,
  UpdateIsEditableDto,
  UpdateProjectDto
} from './dto/project.dto'
import { RequestJWT } from 'types'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { adminPermissions, userPermissions } from 'enums'
import { RolesGuard } from 'guards/role.guard'
import { Roles } from 'guards/roles.decorator'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.create)
  create(@Body() data: CreateProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.createMyProject(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.update)
  updateMyProject(
    @Body() data: UpdateProjectDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.updateMyProject(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteMyProject(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.delete)
  deleteMany(@Body() data: DeleteManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteManyMyProjects(data, userId)
  }

  @Get('me/:projectId/quotation')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.view)
  findManyQuotationInMyProjects(
    @Param('projectId') projectId: string,
    @Query() data: FindManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findManyQuotationInMyProjects(
      projectId,
      data,
      userId
    )
  }

  @Get('me/:projectId/quotation/:quotationId')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.view)
  findOneQuotationInMyProject(
    @Param('projectId') projectId: string,
    @Param('quotationId') quotationId: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findOneQuotationInMyProject(
      quotationId,
      projectId,
      userId
    )
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.project))
  findOneByMe(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.findOneByMe(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.project))
  findMyProjects(
    @Query() data: FindManyProjectDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findMyProjects(data, userId)
  }

  @Get('public/:projectId')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.viewPublic)
  findOnePublicProject(@Param('projectId') projectId: string) {
    return this.projectService.findOnePublicProject(projectId)
  }

  @Get('public')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.viewPublic)
  findPublicProjects(@Query() data: FindManyProjectDto) {
    return this.projectService.findPublicProjects(data)
  }

  @Patch('me/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.project.cancel)
  cancelMyProject(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request

    return this.projectService.cancelMyProject(id, userId)
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.project.approve)
  approve(@Param('id') id: string) {
    return this.projectService.approve(id)
  }

  @Patch(':id/request-edit')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.project.requestEdit)
  requestEdit(@Param('id') id: string, @Body() data: UpdateIsEditableDto) {
    return this.projectService.toggleRequestEdit(id, data)
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.project.cancel)
  cancel(@Param('id') id: string) {
    return this.projectService.cancel(id)
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.project.complete)
  complete(@Param('id') id: string) {
    return this.projectService.complete(id)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(adminPermissions.project))
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(adminPermissions.project))
  findMany(@Query() data: FindManyProjectDto) {
    return this.projectService.findMany(data)
  }
}
