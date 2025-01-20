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
import { RolesGuard } from 'guards/role.guard'
import { Roles } from 'guards/roles.decorator'
import { adminPermissions, userPermissions } from 'enums'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.user.create)
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data)
  }

  @Patch('change-my-password')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.user.changePassword)
  changeMyPassword(
    @Body() data: ChangeMyPasswordDto,
    @Req() request: RequestJWT
  ) {
    const { userId } = request
    return this.userService.changeMyPassword(userId, data)
  }

  @Patch('change-password/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.user.update)
  changePassword(@Body() data: ChangePasswordDto, @Param('id') id: string) {
    return this.userService.changePassword(id, data)
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @Roles(userPermissions.user.updateProfile)
  updateMyProfile(@Body() data: UpdateUserDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.userService.updateMyProfile(userId, data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(adminPermissions.user.update)
  update(@Body() data: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(id, data)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    adminPermissions.user.create,
    adminPermissions.user.update,
    adminPermissions.user.view,
    adminPermissions.user.delete
  )
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(
    adminPermissions.user.create,
    adminPermissions.user.update,
    adminPermissions.user.view,
    adminPermissions.user.delete
  )
  findMany(@Query() data: FindManyUserDto) {
    return this.userService.findMany(data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(
    adminPermissions.user.create,
    adminPermissions.user.update,
    adminPermissions.user.view,
    adminPermissions.user.delete
  )
  delete(@Param('id') id: string, @Req() request: RequestJWT) {
    const { userId } = request
    return this.userService.delete(id, userId)
  }

  @Delete('')
  @HttpCode(HttpStatus.OK)
  @Roles(
    adminPermissions.user.create,
    adminPermissions.user.update,
    adminPermissions.user.view,
    adminPermissions.user.delete
  )
  deleteMany(@Body() data: DeleteManyUserDto, @Req() request: RequestJWT) {
    const { userId } = request
    return this.userService.deleteMany(data, userId)
  }
}
