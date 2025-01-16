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
  createMyProject(@Body() data: CreateProductDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.createMyProject(data, userId)
  }

  @Patch('me/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateMyProject(
    @Body() data: UpdateProductDto,
    @Param('id') id: string,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.updateMyProject(id, data, userId)
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteMyProject(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.deleteMyProject(id, userId)
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteManyMyProjects(
    @Body() data: DeleteManyProductDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.deleteManyMyProjects(data, userId)
  }

  @Get('me/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOneMyProject(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.productService.findOneMyProject(id, userId)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findManyMyProjects(
    @Query() data: FindManyProductDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.productService.findManyMyProjects(data, userId)
  }
}
