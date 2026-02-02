import { Module } from '@nestjs/common';
import { redisClientProvider } from './redis-client.provider';

@Module({
  providers: [redisClientProvider],
  exports: [redisClientProvider],
})
export class RedisClientModule {}