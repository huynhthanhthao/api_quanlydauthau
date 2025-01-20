import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    )

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const userPermissionCodes = new Set(
      request.roles?.flatMap(role =>
        role.permissions.map(permission => permission.code)
      ) || []
    )

    const hasPermission = requiredRoles.some(role =>
      userPermissionCodes.has(role)
    )

    return hasPermission
  }
}
