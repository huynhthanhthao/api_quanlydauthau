import { Module } from '@nestjs/common'
import { EstimateService } from './estimate.service'
import { EstimateController } from './estimate.controller'

@Module({
  controllers: [EstimateController],
  providers: [EstimateService]
})
export class EstimateModule {}
