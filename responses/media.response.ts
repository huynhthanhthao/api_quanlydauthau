import { Prisma } from '@prisma/client'

export const mediaSelect: Prisma.MediaSelect = {
  id: true,
  name: true,
  path: true,
  createdAt: true
}
