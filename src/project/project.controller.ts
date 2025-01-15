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
    return this.projectService.create(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() data: UpdateProjectDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.update(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.delete(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteMany(@Body() data: DeleteManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteMany(data, userId)
  }

  @Get('me/:projectId/quotation')
  @HttpCode(HttpStatus.OK)
  findManyQuotation(
    @Param('projectId') projectId: string,
    @Query() data: FindManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findManyQuotation(projectId, data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.findOne(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.findMany(data, userId)
  }
}
