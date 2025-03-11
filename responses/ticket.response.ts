import { Prisma } from '@prisma/client'
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
  assignees: {
    select: {
      id: true,
      name: true,
      phone: true,
      avatar: true,
      email: true
    }
  }
}

export const ticketCommentSelect: Prisma.TicketCommentSelect = {
  id: true,
  content: true,
  createdAt: true,
  ticketId: true,
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
