import * as config from 'config'

const jwtJsonConfig = config.get('jwt')

const jwtConfig: {
  secret: string
  expiresIn: number
} = jwtJsonConfig

export default jwtConfig
