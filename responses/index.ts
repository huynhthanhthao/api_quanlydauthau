import { Prisma } from '@prisma/client'

export const categorySelect: Prisma.CategorySelect = {
  id: true,
  name: true,
  thumb: true,
  desc: true,
  updatedAt: true
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
      updatedAt: true
    }
  }
}

export const productCaptureSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  thumb: true,
  desc: true,
  producer: true,
  updatedAt: true
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

export const projectSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  desc: true,
  address: true,
  status: true,
  updatedAt: true,
  projectItems: {
    select: {
      id: true,
      productCapture: true,
      quantity: true,
      updatedAt: true
    }
  }
}

export const quotationSelect: Prisma.QuotationSelect = {
  id: true,
  name: true,
  desc: true,
  price: true,
  status: true,
  project: {
    select: {
      id: true,
      name: true,
      code: true,
      desc: true,
      address: true,
      status: true,
      updatedAt: true
    }
  },
  updatedAt: true
}

export const quotationDetailSelect: Prisma.QuotationSelect = {
  id: true,
  name: true,
  desc: true,
  price: true,
  status: true,
  items: {
    select: {
      id: true,
      productCapture: true,
      attachedFiles: true,
      quantity: true,
      updatedAt: true
    }
  },
  project: {
    select: {
      id: true,
      name: true,
      code: true,
      desc: true,
      address: true,
      status: true,
      updatedAt: true
    }
  },
  updatedAt: true
}
