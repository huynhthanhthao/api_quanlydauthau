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
import { UserService } from './user.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { RequestJWT } from 'types'
import {
  CreateUserDto,
  UpdateUserDto,
  FindManyUserDto,
  DeleteManyUserDto,
  ChangePasswordDto,
  ChangeMyPasswordDto
} from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data)
  }

  @Patch('change-my-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  changeMyPassword(
    @Body() data: ChangeMyPasswordDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.userService.changeMyPassword(userId, data)
  }

  @Patch('change-password/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() data: ChangePasswordDto, @Param('id') id: string) {
    return this.userService.changePassword(id, data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Body() data: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(id, data)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  findMany(@Query() data: FindManyUserDto) {
    return this.userService.findMany(data)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.userService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deleteMany(@Body() data: DeleteManyUserDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.userService.deleteMany(data, userId)
  }
}
