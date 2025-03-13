import { Prisma } from '@prisma/client'
import { userSortSelect } from './user.response'
export const ticketSelect: Prisma.TicketSelect = {
  id: true,
  type: true,
  code: true,
  status: true,
  title: true,
  createdAt: true,
  lastCommentAt: true,
  lastComment: true,
  creator: {
    select: userSortSelect
  },
  assignees: {
    select: userSortSelect
  }
}

export const ticketCommentSelect: Prisma.TicketCommentSelect = {
  id: true,
  content: true,
  createdAt: true,
  ticketId: true,
  creator: {
    select: userSortSelect
  }
}
