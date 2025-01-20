import { Module } from '@nestjs/common'
import { PermissionGroupService } from './permission-group.service'
import { PermissionGroupController } from './permission-group.controller'

@Module({
  controllers: [PermissionGroupController],
  providers: [PermissionGroupService]
})
export class PermissionGroupModule {}
