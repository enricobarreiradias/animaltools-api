import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import redisConfig from '@lib/config/redis'
import { redisClientProvider } from './redis-client.provider'

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.MAIN_CACHE_HOST || redisConfig.host,
            port: Number(process.env.MAIN_CACHE_PORT || redisConfig.port)
          },
          password: process.env.MAIN_CACHE_PASSWORD || redisConfig.password
        }),
        ttl: 0 // ou o TTL que você quiser
      })
    })
  ],
  providers: [redisClientProvider],
  exports: [CacheModule, redisClientProvider]
})
export class MainCacheModule {}
