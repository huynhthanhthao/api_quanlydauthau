import { Prisma } from '.prisma/client'

export const permissionGroupSelect: Prisma.PermissionGroupSelect = {
  id: true,
  name: true,
  permissions: true
}
