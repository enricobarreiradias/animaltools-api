import { Module } from '@nestjs/common'
import { MainCacheModule } from '@lib/data/main-cache.module'
import { SharedAuthPermissionIntegrationService } from './shared-auth-permissions-integration.service'
import { SharedAuthIntegrationModule } from '../shared-auth-integration/shared-auth-integration.module'
import { UserIntegrationSubscriber } from '@lib/data/subscribers/animaltools/user-integration.subscriber'
import { LotSubscriber } from '@lib/data/subscribers/animaltools/lot.subscriber'

@Module({
  imports: [MainCacheModule, SharedAuthIntegrationModule],
  providers: [UserIntegrationSubscriber, LotSubscriber, SharedAuthPermissionIntegrationService],
  exports: [SharedAuthPermissionIntegrationService]
})
export class SharedAuthPermissionIntegrationModule {}
