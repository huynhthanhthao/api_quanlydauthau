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

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(
    @Body() data: UpdateProjectDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.update(id, data, userId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body() data: DeleteManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.deleteMany(data, userId)
  }

  @Get(':projectId/quotation')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findManyQuotation(
    @Param('projectId') projectId: string,
    @Query() data: FindManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.projectService.findManyQuotation(projectId, data, userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.findOne(id, userId)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyProjectDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.projectService.findMany(data, userId)
  }
}
