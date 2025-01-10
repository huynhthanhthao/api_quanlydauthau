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
      updatedAt: true
    }
  }
}

export const PRODUCT_SELECT: Prisma.ProductSelect = {
  id: true,
  name: true,
  thumb: true,
  desc: true,
  producer: true,
  updatedAt: true,
  categories: {
    select: {
      id: true,
      name: true,
      thumb: true,
      desc: true,
      parentId: true,
      updatedAt: true
    }
  }
}
