import { Prisma } from '@prisma/client'

export const categorySelect: Prisma.CategorySelect = {
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

export const productSelect: Prisma.ProductSelect = {
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

export const unitSelect: Prisma.UnitSelect = {
  id: true,
  name: true,
  code: true,
  desc: true,
  updatedAt: true,
  creator: true,
  updater: true
}
