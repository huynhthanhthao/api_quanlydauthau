import { Prisma } from '@prisma/client'

export const CATEGORY_SELECT: Prisma.CategorySelect = {
  id: true,
  name: true,
  thumb: true,
  desc: true,
  parentId: true,
  updatedAt: true,
  parent: {
    select: {
      id: true,
      name: true,
      thumb: true,
      desc: true,
      parentId: true,
      updatedAt: true,
    },
  },
}
