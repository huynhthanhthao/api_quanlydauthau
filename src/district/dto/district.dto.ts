import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { FindManyDto } from 'utils/common.dto'

export class CreateDistrictDto {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  name: string
}

export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}

export class FindManyDistrictDto extends FindManyDto {}
