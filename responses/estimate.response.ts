import { Prisma } from '.prisma/client'
import { projectSortSelect } from './project.response'
import { userSortSelect } from './user.response'
import { prioritySelect } from './priority.response'
import { companySelect } from './company.response'

export const estimateSelect: Prisma.EstimateSelect = {
  id: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  project: {
    select: projectSortSelect
  },
  _count: {
    select: {
      productEstimates: true
    }
  },
  creator: {
    select: userSortSelect
  }
}

export const estimateDetailSelect: Prisma.EstimateSelect = {
  id: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  project: {
    select: {
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
      priority: {
        select: prioritySelect
      },
      creator: {
        select: userSortSelect
      }
    }
  },
  productEstimates: {
    select: {
      id: true,
      name: true,
      desc: true
    }
  },
  creator: {
    select: userSortSelect
  }
}
