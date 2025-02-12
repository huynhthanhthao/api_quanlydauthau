import {
  IsNotEmpty,
  registerDecorator,
  ValidationOptions
} from 'class-validator'

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

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVietnamesePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^0\d{9,10}$/
          return typeof value === 'string' && regex.test(value)
        },
        defaultMessage() {
          return `phone must be a valid phone numbers`
        }
      }
    })
  }
}
