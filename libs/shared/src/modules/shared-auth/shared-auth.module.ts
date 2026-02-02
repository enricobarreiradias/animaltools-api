import { Module } from '@nestjs/common'
import { SharedAuthService } from './shared-auth.service'
import { MainCacheModule } from '@lib/data/main-cache.module'

@Module({
  imports: [MainCacheModule],
  providers: [SharedAuthService],
  exports: [SharedAuthService]
})
export class SharedAuthModule {}
