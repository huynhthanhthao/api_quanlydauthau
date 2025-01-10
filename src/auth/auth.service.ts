import { UserStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { LoginDto } from './dto/auth.dto'
import { JWT_TOKEN_TIME } from 'enums'
import { TokenSign } from 'types'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    })

    if (!user || !bcrypt.compareSync(data.password, user.password))
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.CONFLICT
      )

    if (user.status !== UserStatus.ACTIVE)
      throw new HttpException('Tài khoản đã bị khóa!', HttpStatus.FORBIDDEN)

    const accessToken = await this.generateToken(
      { userId: user.id },
      JWT_TOKEN_TIME,
      process.env.SECRET_KEY
    )

    delete user.password

    return { user, accessToken }
  }

  async generateToken(data: TokenSign, time: string, key: string) {
    return await this.jwtService.signAsync(
      { userId: data.userId },
      {
        expiresIn: time,
        secret: key,
      }
    )
  }

  async getMe(token: string) {
    try {
      const payload: TokenSign = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      })

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      })

      delete user.password

      return { user }
    } catch (error) {
      console.log(error)

      throw new HttpException(
        'Phiên bản đăng nhập hết hạn!',
        HttpStatus.CONFLICT
      )
    }
  }
}
