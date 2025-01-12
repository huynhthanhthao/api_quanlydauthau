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
import { CategoryService } from './category.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import {
  CreateCategoryDto,
  DeleteManyCategoryDto,
  FindManyCategoryDto,
  UpdateCategoryDto
} from './dto/category.dto'
import { RequestJWT } from 'types'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateCategoryDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.categoryService.create(data, userId)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Body() data: UpdateCategoryDto, @Param('id') id: string) {
    return this.categoryService.update(id, data)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyCategoryDto) {
    return this.categoryService.findMany(data)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.categoryService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body() data: DeleteManyCategoryDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.categoryService.deleteMany(data, userId)
  }
}
