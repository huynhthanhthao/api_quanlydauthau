import { Prisma } from '@prisma/client'
import { companySelect } from './company.response'
import { userSortSelect } from './user.response'
import { prioritySelect } from './priority.response'
import { estimateSelect } from './estimate.response'

export const projectSelect = (userId?: string): Prisma.ProjectSelect => ({
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
  _count: {
    select: {
      estimates: {
        ...(userId && { where: { creatorId: userId } })
      }
    }
  },
  creator: {
    select: userSortSelect
  }
})

export const projectDetailSelect = (userId?: string): Prisma.ProjectSelect => ({
  id: true,
  name: true,
  code: true,
  address: true,
  status: true,
  estDeadline: true,
  updatedAt: true,
  createdAt: true,
  estimates: {
    ...(userId && { where: { creatorId: userId } }),
    select: estimateSelect
  },
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
  _count: {
    select: {
      estimates: {
        ...(userId && { where: { creatorId: userId } })
      }
    }
  },
  creator: {
    select: userSortSelect
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
