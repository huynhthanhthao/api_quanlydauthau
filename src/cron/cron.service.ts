import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  async autoCloseTickets() {
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const ticketsToClose = await this.prisma.ticket.findMany({
      where: {
        status: { in: ['IN_PROGRESS', 'RESOLVED'] },
        lastCommentAt: { lt: twoDaysAgo }
      }
    })

    if (!ticketsToClose.length) return 0

    await Promise.all(
      ticketsToClose.map(ticket =>
        this.prisma.ticket.update({
          where: { id: ticket.id },
          data: {
            status: 'CLOSED'
          }
        })
      )
    )

    return ticketsToClose.length
  }
}
