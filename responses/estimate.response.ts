import { Prisma } from '.prisma/client'
import { projectSortSelect } from './project.response'
import { userSortSelect } from './user.response'

export const estimateSelect: Prisma.EstimateSelect = {
  id: true,
  name: true,
  status: true,
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
  project: {
    select: projectSortSelect
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
