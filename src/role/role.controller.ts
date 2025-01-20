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

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Body() data: UpdateRoleDto, @Param('id') id: string) {
    return this.roleService.update(id, data)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.roleService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body() data: DeleteManyRoleDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.roleService.deleteMany(data, userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyRoleDto) {
    return this.roleService.findMany(data)
  }
}
