import { AnyObject, PaginationArgs } from 'types'
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination'
import { DESTINATION_PATH, MAX_SIZE_FILE, PER_PAGE } from 'enums'
import { PrismaClient } from '@prisma/client'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

export async function paginate<
  T extends keyof PrismaClient,
  M extends PrismaClient[T]
>(
  prismaModel: M,
  queryArgs: AnyObject,
  paginationArgs: PaginationArgs
): Promise<ReturnType<PaginatorTypes.PaginateFunction>> {
  const paginateFn: PaginatorTypes.PaginateFunction = paginator({
    perPage: paginationArgs.perPage || PER_PAGE
  })

  return await paginateFn(prismaModel, queryArgs, paginationArgs)
}

export function CustomFilesInterceptor(
  fieldName: string,
  maxFiles: number,
  fileSize: number = MAX_SIZE_FILE
) {
  return FilesInterceptor(fieldName, maxFiles, {
    storage: diskStorage({
      destination: DESTINATION_PATH,
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
    limits: { fileSize }
  })
}

export function CustomFileInterceptor(
  fieldName: string,
  fileSize: number = MAX_SIZE_FILE
) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: DESTINATION_PATH,
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
    limits: { fileSize }
  })
}
