import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: LoginDto) {
    return this.authService.login(data)
  }

  @Get('/get-me')
  @HttpCode(HttpStatus.OK)
  getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader)
      throw new HttpException(
        'Không tìm thấy auth header!',
        HttpStatus.NOT_FOUND
      )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = authHeader.split(' ')

    if (!token)
      throw new HttpException('Không tìm thấy token!', HttpStatus.NOT_FOUND)

    return this.authService.getMe(token)
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { token: string }) {
    return this.authService.refreshToken(body.token)
  }
}
