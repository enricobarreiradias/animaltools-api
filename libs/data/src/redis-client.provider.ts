import { createClient } from 'redis'
import redisConfig from '@lib/config/redis'

export const redisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      socket: {
        host: process.env.MAIN_CACHE_HOST || redisConfig.host,
        port: Number(process.env.MAIN_CACHE_PORT || redisConfig.port)
      },
      password: process.env.MAIN_CACHE_PASSWORD || redisConfig.password
    })

    await client.connect()
    return client as any // <-- resolve o problema
  }
}
