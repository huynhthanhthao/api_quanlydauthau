export interface AnyObject {
  [key: string]: any
}

export interface PaginationArgs {
  page: number
  perPage: number
}

export interface TokenSign {
  userId: string
}

export interface TokenSign {
  userId: string
}

export interface RequestJWT extends Request {
  userId: string
  role: AnyObject
}
