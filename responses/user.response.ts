import { Prisma } from '.prisma/client'
import { companySelect } from './company.response'

export const userSortSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  company: {
    select: {
      id: true,
      name: true,
      phone: true,
      logo: true
    }
  }
}

export const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  status: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      name: true
    }
  },
  company: {
    select: companySelect
  }
}

export const userDetailSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  status: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  birthDate: true,
  company: {
    select: companySelect
  },
  updatedAt: true,
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
  role: {
    select: {
      id: true,
      name: true,
      permissions: {
        select: {
          code: true,
          name: true
        }
      }
    }
  }
}

export const userLoginSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  password: true,
  status: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  birthDate: true,
  company: {
    select: {
      id: true,
      name: true,
      phone: true,
      logo: true
    }
  },
  updatedAt: true,
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
  role: {
    select: {
      id: true,
      name: true,
      permissions: {
        select: {
          code: true,
          name: true
        }
      }
    }
  }
}
