import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { AnyObject } from 'types'

export interface Response<T> {
  statusCode: number
  message: string
  response: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: AnyObject) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data?.message ?? 'Thành công!',
        response: data as T
      }))
    )
  }
}
