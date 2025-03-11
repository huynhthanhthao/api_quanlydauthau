import { Injectable } from '@nestjs/common'
import { CreatedMediaDto } from './dto/media.dto'
import { PrismaService } from 'nestjs-prisma'
import { mediaSelect } from 'responses/media.response'
@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}
  async upload(data: CreatedMediaDto) {
    return this.prisma.media.create({ data, select: mediaSelect })
  }

  async uploadMultiple(data: CreatedMediaDto[]) {
    await this.prisma.media.createMany({ data })

    return this.prisma.media.findMany({
      where: {
        path: {
          in: data.map(d => d.path)
        }
      },
      select: mediaSelect
    })
  }
}
