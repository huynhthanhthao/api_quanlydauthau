import { IsNotEmpty } from 'class-validator'

export class FindManyDto {
  page?: number
  perPage?: number
  orderKey?: string = 'createdAt'
  orderValue?: string = 'desc'
  keyword?: string
}

export class DeleteManyDto {
  ids: string[]
}

export class checkExistenceDto {
  @IsNotEmpty()
  key: string

  @IsNotEmpty()
  value: string
}
