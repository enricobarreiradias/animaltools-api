import * as config from 'config'

const redisConfigFile = config.get('redis.animaltoolscache')

const redisConfig: {
  host: string
  password: string
  port: number
  tls: boolean
} = redisConfigFile

export default redisConfig
