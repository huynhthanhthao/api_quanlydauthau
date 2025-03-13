import { AnyObject, PaginationArgs } from 'types'
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination'
import { PUBLIC_PATH, MAX_SIZE_FILE, PER_PAGE } from 'enums'
import { PrismaClient } from '@prisma/client'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

export async function paginate<
  T extends keyof PrismaClient,
  M extends PrismaClient[T]
>(prismaModel: M, queryArgs: AnyObject, paginationArgs: PaginationArgs) {
  const paginateFn: PaginatorTypes.PaginateFunction = paginator({
    perPage: paginationArgs.perPage || PER_PAGE
  })

  const result = await paginateFn(prismaModel, queryArgs, paginationArgs)

  const totalPages = Math.ceil(result.meta.total / result.meta.perPage)

  return {
    ...result,
    meta: {
      ...result.meta,
      totalPages
    }
  }
}

export function CustomFilesInterceptor(
  fieldName: string,
  maxFiles: number,
  destination: string
) {
  return FilesInterceptor(fieldName, maxFiles, {
    storage: diskStorage({
      destination: destination,
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
    limits: { fileSize: MAX_SIZE_FILE }
  })
}

export function CustomFileInterceptor(fieldName: string) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: PUBLIC_PATH,
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
    limits: { fileSize: MAX_SIZE_FILE }
  })
}

export function generateCodeUUID() {
  const uuid = crypto.randomUUID()
  return uuid
    .replace(/-/g, '')
    .split('')
    .map(char => char.charCodeAt(0).toString())
    .join('')
    .slice(0, 15)
}

export function extractPermissions(data: AnyObject) {
  return Object.values(data)
}

export function hasPermission(codes: string[], permissionCodes: string[]) {
  return codes.some(code => permissionCodes.includes(code))
}
