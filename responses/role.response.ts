import { Prisma } from '@prisma/client'

export const roleSelect: Prisma.RoleSelect = {
  id: true,
  name: true,
  permissions: {
    select: {
      code: true,
      name: true
    }
  }
}
