import * as config from 'config'

const redisConfigFile = config.get('redis.animaltoolscache')

const redisConfig: {
  host: string
  password: string
  port: number
  tls: boolean
} = redisConfigFile as { host: string; password: string; port: number; tls: boolean }

export default redisConfig
