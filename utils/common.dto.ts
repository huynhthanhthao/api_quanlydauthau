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
