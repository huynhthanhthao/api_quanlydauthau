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

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  createMyProduct(@Body() data: CreateProductDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.createMyProduct(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateMyProduct(
    @Body() data: UpdateProductDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.updateMyProduct(id, data, userId)
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteMyProduct(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.deleteMyProduct(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteManyMyProducts(
    @Body() data: DeleteManyProductDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.deleteManyMyProducts(data, userId)
  }

  @Get('me/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOneMyProduct(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.findOneMyProduct(id, userId)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findManyMyProducts(
    @Query() data: FindManyProductDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.findManyMyProducts(data, userId)
  }
}
