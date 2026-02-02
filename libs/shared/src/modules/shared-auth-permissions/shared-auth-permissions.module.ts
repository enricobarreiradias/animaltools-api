import { MainCacheModule } from '@lib/data/main-cache.module'
import { UserPermissionSubscriber } from '@lib/data/subscribers/animaltools/user-permission.subscriber'
import { LotSubscriber } from '@lib/data/subscribers/animaltools/lot.subscriber'
import { UserLotSubscriber } from '@lib/data/subscribers/animaltools/user-lot.subscriber'
import { UserPenSubscriber } from '@lib/data/subscribers/animaltools/user-pen.subscriber'
import { UserSubscriber } from '@lib/data/subscribers/animaltools/user.subscriber'
import { Module } from '@nestjs/common'
import { SharedAuthPermissionIntegrationService } from '../shared-auth-permissions-integration/shared-auth-permissions-integration.service'
import { SharedAuthModule } from '../shared-auth/shared-auth.module'
import { SharedAuthPermissionService } from './shared-auth-permissions.service'

@Module({
  imports: [MainCacheModule, SharedAuthModule],
  providers: [
    LotSubscriber,
    UserLotSubscriber,
    UserPenSubscriber,
    UserSubscriber,
    UserPermissionSubscriber,
    SharedAuthPermissionService,
    SharedAuthPermissionIntegrationService
  ],
  exports: [SharedAuthPermissionService]
})
export class SharedAuthPermissionModule {}
