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
import { PROJECT_PATH, PUBLIC_PATH } from 'enums'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file.path)
  }

  @Post('upload-files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFilesInterceptor('files', 10, PUBLIC_PATH))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const fileURLs = files.map(file => {
      return file.path.replace(/\\/g, '/')
    })

    return this.mediaService.uploadMultiple(fileURLs)
  }

  @Post('upload-files-to-project')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFilesInterceptor('files', 10, PROJECT_PATH))
  uploadToProject(@UploadedFiles() files: Express.Multer.File[]) {
    const fileURLs = files.map(file => {
      return file.path.replace(/\\/g, '/')
    })

    return this.mediaService.uploadToProject(fileURLs)
  }
}
