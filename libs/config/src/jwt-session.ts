import * as config from 'config'

const jwtJsonConfig = config.get('jwtSession')

const jwtSessionConfig: {
  secret: string
  expiresIn: number
  timeUnity: string
} = jwtJsonConfig

export default jwtSessionConfig
