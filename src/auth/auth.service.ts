import * as bcrypt from 'bcrypt'
import { UserStatus } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { LoginDto } from './dto/auth.dto'
import { TokenSign } from 'types'
import { userLoginSelect } from 'responses'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.username
      },
      select: userLoginSelect
    })

    if (!user || !bcrypt.compareSync(data.password, user.password))
      throw new HttpException(
        'Tài khoản hoặc mật khẩu không chính xác!',
        HttpStatus.CONFLICT
      )

    if (user.status !== UserStatus.ACTIVE)
      throw new HttpException('Tài khoản đã bị khóa!', HttpStatus.FORBIDDEN)

    const [refreshToken, accessToken] = await Promise.all([
      this.getRefreshToken(user.id),
      this.generateToken(
        { userId: user.id },
        process.env.JWT_TOKEN_TIME,
        process.env.SECRET_KEY_TOKEN
      )
    ])

    delete user.password

    return { user, accessToken, refreshToken }
  }

  async getRefreshToken(userId: string) {
    const refreshToken = await this.generateToken(
      { userId },
      process.env.JWT_REFRESH_TOKEN_TIME,
      process.env.SECRET_KEY_REFRESH_TOKEN
    )

    await this.prisma.userSession.create({
      data: {
        userId: userId,
        refreshToken
      }
    })

    return refreshToken
  }

  async generateToken(data: TokenSign, time: string, key: string) {
    return await this.jwtService.signAsync(
      { userId: data.userId },
      {
        expiresIn: time,
        secret: key
      }
    )
  }

  async getMe(token: string) {
    try {
      const payload: TokenSign = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_TOKEN
      })

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId
        },
        select: userLoginSelect
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

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY_REFRESH_TOKEN
      })
      const user = await this.prisma.userSession.findFirst({
        where: { refreshToken: token, userId: decoded.userId }
      })

      if (!user)
        throw new HttpException(
          'Refresh Token không hợp lệ',
          HttpStatus.UNAUTHORIZED
        )

      const [refreshToken, accessToken] = await Promise.all([
        this.getRefreshToken(decoded.userId),
        this.generateToken(
          { userId: decoded.userId },
          process.env.JWT_TOKEN_TIME,
          process.env.SECRET_KEY_TOKEN
        )
      ])

      return { accessToken, refreshToken }
    } catch (error) {
      console.log(error)

      throw new HttpException(
        'Refresh Token không hợp lệ',
        HttpStatus.UNAUTHORIZED
      )
    }
  }
}
