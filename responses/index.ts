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
  updatedAt: true,
  productAttributes: {
    select: {
      key: true,
      value: true
    }
  }
}

export const productDetailSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  thumb: true,
  desc: true,
  updatedAt: true,
  productAttributes: {
    select: {
      key: true,
      value: true
    }
  }
}

export const productCaptureSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  thumb: true,
  desc: true,
  updatedAt: true
}

export const unitSelect: Prisma.UnitSelect = {
  id: true,
  name: true,
  code: true,
  desc: true,
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true
    }
  }
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
      updatedAt: true,
      unit: true
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
      updatedAt: true,
      unit: true
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
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true
    }
  }
}

export const ticketSelect: Prisma.TicketSelect = {
  id: true,
  type: true,
  code: true,
  status: true,
  title: true,
  createdAt: true,
  lastCommentAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true
    }
  },
  assignees: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true
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
  }
}

export const ticketCommentSelect: Prisma.TicketCommentSelect = {
  id: true,
  content: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true
    }
  }
}

export const companySelect: Prisma.CompanySelect = {
  id: true,
  name: true,
  address: true,
  email: true,
  phone: true,
  tax: true,
  website: true,
  logo: true,
  representativeName: true,
  representativePosition: true,
  updatedAt: true,
  createdAt: true
}

export const companyDetailSelect: Prisma.CompanySelect = {
  id: true,
  name: true,
  address: true,
  email: true,
  phone: true,
  tax: true,
  website: true,
  logo: true,
  representativeName: true,
  representativePosition: true,
  ward: {
    select: {
      code: true,
      codeName: true,
      name: true,
      district: {
        select: {
          code: true,
          codeName: true,
          shortCodeName: true,
          city: {
            select: {
              code: true,
              name: true,
              phoneCode: true
            }
          }
        }
      }
    }
  },
  updatedAt: true,
  createdAt: true
}
