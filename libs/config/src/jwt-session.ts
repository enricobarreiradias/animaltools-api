import * as config from 'config'

const jwtJsonConfig = config.get('jwtSession')

const jwtSessionConfig: {
  secret: string
  expiresIn: number
  timeUnity: string
} = jwtJsonConfig as { secret: string; expiresIn: number; timeUnity: string }

export default jwtSessionConfig
