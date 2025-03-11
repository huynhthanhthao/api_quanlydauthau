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
import { CompanyService } from './company.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RequestJWT } from 'types'
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  DeleteManyCompanyDto,
  FindManyCompanyDto
} from './dto/company.dto'
import { Roles } from 'guards/roles.decorator'
import { RolesGuard } from 'guards/role.guard'
import { permissions } from 'enums'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.create)
  create(@Body() data: CreateCompanyDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.companyService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.update)
  update(
    @Body() data: UpdateCompanyDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.companyService.update(id, data, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.companyService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.company.delete)
  deleteMany(@Body() data: DeleteManyCompanyDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.companyService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.company))
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.company))
  findMany(@Query() data: FindManyCompanyDto) {
    return this.companyService.findMany(data)
  }
}
