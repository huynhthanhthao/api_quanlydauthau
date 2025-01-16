import { Injectable } from '@nestjs/common'
@Injectable()
export class MediaService {
  async upload(fileURL: string) {
    return fileURL
  }

  async uploadMultiple(fileURLs: string[]) {
    return fileURLs
  }

  async uploadToProject(fileURLs: string[]) {
    return fileURLs
  }
}
