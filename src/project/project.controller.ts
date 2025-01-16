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
  UpdateProjectDto
} from './dto/project.dto'
import { RequestJWT } from 'types'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  create(@Body() data: CreateProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.createMyProject(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
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
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteMyProject(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteMany(@Body() data: DeleteManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteManyMyProjects(data, userId)
  }

  @Get('me/:projectId/quotation')
  @HttpCode(HttpStatus.OK)
  findManyQuotation(
    @Param('projectId') projectId: string,
    @Query() data: FindManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findManyMyQuotations(projectId, data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.findOne(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMyProjects(
    @Query() data: FindManyProjectDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findMyProjects(data, userId)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyProjectDto) {
    return this.projectService.findMany(data)
  }

  @Get('public')
  @HttpCode(HttpStatus.OK)
  findPublicProjects(@Query() data: FindManyProjectDto) {
    return this.projectService.findPublicProjects(data)
  }

  @Patch('me/:id/cancel')
  @HttpCode(HttpStatus.OK)
  cancelMyProject(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request

    return this.projectService.cancelMyProject(id, userId)
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  approve(@Param('id') id: string) {
    return this.projectService.approve(id)
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id') id: string) {
    return this.projectService.cancel(id)
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@Param('id') id: string) {
    return this.projectService.complete(id)
  }
}
