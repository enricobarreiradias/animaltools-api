import { Module } from '@nestjs/common'
import { MainCacheModule } from '@lib/data/main-cache.module'
import { SharedAuthIntegrationService } from './shared-auth-integration.service'

@Module({
  imports: [MainCacheModule],
  providers: [SharedAuthIntegrationService],
  exports: [SharedAuthIntegrationService]
})
export class SharedAuthIntegrationModule {}
