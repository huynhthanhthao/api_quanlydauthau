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
import { ProductService } from './product.service'
import {
  CreateProductDto,
  DeleteManyProductDto,
  FindManyProductDto,
  UpdateProductDto
} from './dto/product.dto'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RequestJWT } from 'types'
import { RolesGuard } from 'guards/role.guard'
import { permissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { extractPermissions } from 'utils/helper'

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.product.create)
  create(@Body() data: CreateProductDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.product.update)
  update(
    @Body() data: UpdateProductDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.update(id, data, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.product.delete)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(permissions.product.delete)
  deleteMany(@Body() data: DeleteManyProductDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.deleteMany(data, userId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.product))
  findOne(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.findOne(id, userId)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(permissions.product))
  findMany(@Query() data: FindManyProductDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.findMany(data, userId)
  }
}
