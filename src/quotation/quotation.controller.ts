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
import { QuotationService } from './quotation.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'

import { RequestJWT } from 'types'
import {
  CreateQuotationDto,
  UpdateQuotationDto,
  DeleteManyQuotationDto,
  FindManyQuotationDto
} from './dto/quotation.dto'
import { RolesGuard } from 'guards/role.guard'
import { Roles } from 'guards/roles.decorator'
import { adminPermissions, userPermissions } from 'enums'
import { extractPermissions } from 'utils/helper'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.quotation.create)
  createMyQuotation(
    @Body() data: CreateQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.createMyQuotation(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.quotation.update)
  updateMyQuotations(
    @Body() data: UpdateQuotationDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.updateMyQuotations(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.quotation.delete)
  deleteMyQuotation(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.deleteMyQuotation(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.quotation.delete)
  deleteManyMyQuotations(
    @Body() data: DeleteManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.deleteManyMyQuotations(data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.quotation))
  findOneMyQuotation(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.findOneMyQuotation(id, userId)
  }
  @Get('me/project/:projectId')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.quotation))
  findOneMyQuotationInProject(
    @Param('projectId') projectId: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.findOneMyQuotationInProject(projectId, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.quotation))
  findManyQuotationInMyProjects(
    @Query() data: FindManyQuotationDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.quotationService.findManyQuotationInMyProjects(data, userId)
  }

  @Get('/:id/history')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.quotation))
  getHistories(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.getHistories(id, userId)
  }

  @Patch('me/:id/approve')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.quotation.approve)
  approveQuoteInMyProject(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.approveQuoteInMyProject(id, userId)
  }

  @Patch(':id/request-edit')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.quotation.requestEdit)
  requestEdit(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.quotationService.requestEdit(id, userId)
  }
}
