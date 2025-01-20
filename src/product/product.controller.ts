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
import { userPermissions } from 'enums'
import { Roles } from 'guards/roles.decorator'
import { extractPermissions } from 'utils/helper'

@Controller('product')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.product.create)
  createMyProduct(@Body() data: CreateProductDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.createMyProduct(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.product.update)
  updateMyProduct(
    @Body() data: UpdateProductDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.updateMyProduct(id, data, userId)
  }

  @Delete('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.product.delete)
  deleteMyProduct(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.deleteMyProduct(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.product.delete)
  deleteManyMyProducts(
    @Body() data: DeleteManyProductDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.deleteManyMyProducts(data, userId)
  }

  @Get('me/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.product))
  findOneMyProduct(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.findOneMyProduct(id, userId)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Roles(...extractPermissions(userPermissions.product))
  findManyMyProducts(
    @Query() data: FindManyProductDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.findManyMyProducts(data, userId)
  }
}
