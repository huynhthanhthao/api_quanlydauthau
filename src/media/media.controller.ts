import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { MediaService } from './media.service'
import { JwtAuthGuard } from 'guards/jwt-auth.guard'
import { CustomFileInterceptor, CustomFilesInterceptor } from 'utils/helper'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file.path)
  }

  @Post('upload-many')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFilesInterceptor('files', 10))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const fileURLs = files.map(file => {
      return file.path.replace(/\\/g, '/')
    })

    return this.mediaService.uploadMultiple(fileURLs)
  }
}
