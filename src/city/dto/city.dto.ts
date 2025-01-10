import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { FindManyDto } from 'utils/common.dto'

export class CreateCityDto {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  name: string
}

export class UpdateCityDto extends PartialType(CreateCityDto) {}

export class FindManyCityDto extends FindManyDto {}
