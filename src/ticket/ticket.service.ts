import { Prisma, PrismaClient, TicketStatus } from '.prisma/client'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { ticketCommentSelect, ticketSelect } from 'responses'
import { paginate } from 'utils/helper'
import {
  CreateTicketCommentDto,
  CreateTicketDto,
  FindManyTicketCommentDto,
  FindManyTicketDto,
  UpdateTicketDto
} from './dto/ticket.dto'

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto, userId: string) {
    const assignee = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            phone: data.assignee
          },
          {
            email: data.assignee
          }
        ]
      }
    })

    if (!assignee)
      throw new HttpException('Người dùng không tồn tại!', HttpStatus.NOT_FOUND)

    const assigneeIds = [userId, assignee.id]

    return this.prisma.ticket.create({
      data: {
        code: this.generateTicketCode(),
        title: data.title,
        status: TicketStatus.OPEN,
        type: data.type,
        creatorId: userId,
        projectId: data.projectId,
        lastCommentAt: new Date(),
        lastComment: data.content,
        comments: {
          create: {
            content: data.content,
            creatorId: userId
          }
        },
        assignees: {
          connect: assigneeIds.map(id => ({ id }))
        }
      },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            email: true
          }
        }
      }
    })
  }

  generateTicketCode() {
    const uuid = crypto.randomUUID()
    return (
      'TIC' +
      uuid
        .replace(/-/g, '')
        .split('')
        .map(char => char.charCodeAt(0).toString())
        .join('')
        .slice(0, 10)
    )
  }

  async createComment(
    ticketId: string,
    data: CreateTicketCommentDto,
    userId: string
  ) {
    return await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const ticket = await prisma.ticket.update({
        where: {
          id: ticketId,
          assignees: {
            some: {
              id: userId
            }
          }
        },
        data: { lastCommentAt: new Date(), lastComment: data.content },
        include: {
          assignees: { select: { id: true } }
        }
      })

      if (ticket.status === TicketStatus.CLOSED)
        throw new HttpException('Ticket này đã đóng!', HttpStatus.CONFLICT)

      return prisma.ticketComment.create({
        data: {
          content: data.content,
          ticketId: ticketId,
          creatorId: userId
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatar: true
            }
          }
        }
      })
    })
  }

  async update(id: string, { status }: UpdateTicketDto, userId: string) {
    const ticket = await this.prisma.ticket.findFirstOrThrow({ where: { id } })

    const transitions = {
      OPEN: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      IN_PROGRESS: ['RESOLVED', 'CLOSED'],
      RESOLVED: ['CLOSED'],
      CLOSED: []
    }

    if (!transitions[ticket.status]?.includes(status))
      throw new HttpException(
        'Không thể cập nhật trạng thái trước đó!',
        HttpStatus.CONFLICT
      )

    return this.prisma.ticket.update({
      where: {
        id,
        assignees: {
          some: {
            id: userId
          }
        }
      },
      data: {
        status
      },
      include: {
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
    })
  }

  async findMany(data: FindManyTicketDto, userId: string) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['title', 'code']

    const where: Prisma.TicketWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      assignees: {
        some: {
          id: userId
        }
      }
    }

    return await paginate(
      this.prisma.ticket,
      {
        where,
        select: ticketSelect,
        orderBy: {
          [orderKey]: orderValue
        }
      },
      {
        page,
        perPage
      }
    )
  }

  async findManyMyTicketComments(
    ticketId: string,
    data: FindManyTicketCommentDto,
    userId: string
  ) {
    const { page, perPage, keyword, orderKey, orderValue } = data

    const keySearch = ['content']

    const where: Prisma.TicketCommentWhereInput = {
      ...(keyword && {
        OR: keySearch.map(key => ({
          [key]: { contains: keyword }
        }))
      }),
      ticket: {
        id: ticketId,
        assignees: {
          some: {
            id: userId
          }
        }
      }
    }

    return await paginate(
      this.prisma.ticketComment,
      {
        where,
        select: ticketCommentSelect,
        orderBy: {
          [orderKey]: orderValue
        }
      },
      {
        page,
        perPage
      }
    )
  }

  async findOne(id: string, userId: string) {
    return this.prisma.ticket.findUniqueOrThrow({
      where: {
        id,
        assignees: {
          some: {
            id: userId
          }
        }
      },
      select: ticketSelect
    })
  }
}
