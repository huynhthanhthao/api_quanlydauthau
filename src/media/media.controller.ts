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
import { PUBLIC_PATH } from 'enums'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload({
      name: file.originalname,
      path: file.path.replace(/\\/g, '/')
    })
  }

  @Post('upload-files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CustomFilesInterceptor('files', 10, PUBLIC_PATH))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const data = files.map(file => {
      return { name: file.originalname, path: file.path.replace(/\\/g, '/') }
    })

    return this.mediaService.uploadMultiple(data)
  }
}
