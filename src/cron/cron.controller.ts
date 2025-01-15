import { Controller } from '@nestjs/common'
import { CronService } from './cron.service'
import { Cron } from '@nestjs/schedule'

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Cron('0 0 * * *')
  async handleAutoCloseTickets() {
    const closedCount = await this.cronService.autoCloseTickets()
    console.log(`${closedCount} ticket đã tự động đóng.`)
  }
}
