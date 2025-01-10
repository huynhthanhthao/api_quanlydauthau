import { UserStatus } from '@prisma/client'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'nestjs-prisma'
import { TokenSign } from 'types'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context)
    const authHeader = request.headers?.authorization

    if (!authHeader) return false

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = authHeader.split(' ')

    if (!token)
      throw new HttpException('Không tìm thấy token!', HttpStatus.NOT_FOUND)

    try {
      const payload: TokenSign = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      })

      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: payload.userId,
          status: UserStatus.ACTIVE,
        },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      })

      request.roles = user.roles
      request.userId = user.id
    } catch (error) {
      throw new HttpException('Thông tin đăng nhập không hợp lệ!', error)
    }

    return true
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType() === 'ws') {
      return context.switchToWs().getClient().handshake
    }
    return context.switchToHttp().getRequest()
  }
}
