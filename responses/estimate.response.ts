import { Prisma } from '.prisma/client'
import { projectSortSelect } from './project.response'

export const estimateSelect: Prisma.EstimateSelect = {
  id: true,
  name: true,
  project: {
    select: projectSortSelect
  },
  _count: {
    select: {
      productEstimates: true
    }
  }
}

export const estimateDetailSelect: Prisma.EstimateSelect = {
  id: true,
  name: true,
  project: {
    select: projectSortSelect
  },
  productEstimates: {
    select: {
      id: true,
      name: true,
      desc: true
    }
  }
}
