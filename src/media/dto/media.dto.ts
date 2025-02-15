import { IsNotEmpty } from 'class-validator'

export class CreatedMediaDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  path: string
}
