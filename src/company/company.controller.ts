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

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateCompanyDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.companyService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(
    @Body() data: UpdateCompanyDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.companyService.update(id, data, userId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.companyService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body() data: DeleteManyCompanyDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.companyService.deleteMany(data, userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyCompanyDto) {
    return this.companyService.findMany(data)
  }
}
