import { Prisma, QuotationStatus } from '@prisma/client'
export const projectSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  price: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const projectDetailSelectByAdmin: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  price: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  },
  quotations: {
    where: {
      status: QuotationStatus.APPROVED
    },
    include: {
      items: {
        include: {
          productQuotation: true
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
          company: {
            select: {
              id: true,
              name: true,
              phone: true,
              logo: true
            }
          }
        }
      }
    }
  },
  suppliers: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const publicProjectSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}

export const publicProjectDetailSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          logo: true
        }
      }
    }
  }
}
