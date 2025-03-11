import { Prisma } from '.prisma/client'

export const productSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  desc: true,
  updatedAt: true
}

export const productDetailSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  desc: true,
  updatedAt: true
}
