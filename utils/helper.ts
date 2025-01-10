import { AnyObject, PaginationArgs } from 'types'
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination'
import { PER_PAGE } from 'enums'
import { PrismaClient } from '@prisma/client'

export async function paginate<
  T extends keyof PrismaClient,
  M extends PrismaClient[T],
>(
  prismaModel: M,
  queryArgs: AnyObject,
  paginationArgs: PaginationArgs
): Promise<ReturnType<PaginatorTypes.PaginateFunction>> {
  const paginateFn: PaginatorTypes.PaginateFunction = paginator({
    perPage: paginationArgs.perPage || PER_PAGE,
  })

  return await paginateFn(prismaModel, queryArgs, paginationArgs)
}
