import { Prisma } from '@prisma/client'
import { DeleteManyDto, FindManyDto } from 'utils/common.dto'

export class FindManyTrashDto extends FindManyDto {
  categoryIds?: string[]
  orderKey?: string = 'deletedAt'
  orderValue?: string = 'desc'
}

export class DeleteManyTrashDto extends DeleteManyDto {}

export class CreateTrashDto {
  id: string
  modelName: Prisma.ModelName
  userId: string
  include?: Record<string, boolean>
}

export class CreateManyTrashDto {
  ids: string[]
  modelName: Prisma.ModelName
  userId: string
  include?: Record<string, boolean>
}
