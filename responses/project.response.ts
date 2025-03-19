import { Prisma } from '@prisma/client'
import { companySelect } from './company.response'
import { userSortSelect } from './user.response'
import { prioritySelect } from './priority.response'

export const projectSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  estDeadline: true,
  updatedAt: true,
  createdAt: true,
  inviter: {
    select: companySelect
  },
  investor: {
    select: companySelect
  },
  estimators: {
    select: userSortSelect
  },
  priority: {
    select: prioritySelect
  },
  creator: {
    select: userSortSelect
  },
  _count: {
    select: {
      estimates: true
    }
  }
}

export const projectForEstimatorSelect = (
  userId: string
): Prisma.ProjectSelect => ({
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  estDeadline: true,
  estimates: {
    where: {
      creatorId: userId
    }
  },
  updatedAt: true,
  createdAt: true,
  inviter: {
    select: companySelect
  },
  investor: {
    select: companySelect
  },
  estimators: {
    select: userSortSelect
  },
  priority: {
    select: prioritySelect
  },
  creator: {
    select: userSortSelect
  },
  _count: {
    select: {
      estimates: {
        where: {
          creatorId: userId
        }
      }
    }
  }
})

export const projectSortSelect: Prisma.ProjectSelect = {
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  estDeadline: true,
  updatedAt: true,
  createdAt: true,
  creator: {
    select: userSortSelect
  }
}
