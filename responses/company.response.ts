import { Prisma } from '@prisma/client'
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
