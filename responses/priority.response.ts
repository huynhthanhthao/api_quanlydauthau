import { Prisma } from '@prisma/client'

export const prioritySelect: Prisma.PrioritySelect = {
  id: true,
  name: true,
  color: true,
  createdAt: true,
  updatedAt: true
}

export const priorityDetailSelect: Prisma.PrioritySelect = {
  id: true,
  name: true,
  color: true,
  createdAt: true,
  updatedAt: true
}
