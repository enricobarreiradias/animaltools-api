import * as config from 'config'

const awsJsonConfig = config.get('aws')

const { accessKeyId, secretAccessKey, ...servicesConfig } = awsJsonConfig

const awsConfig: {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  services: {
    ses: {
      region: string
      from: string
      fakeEmailTo: string
    }
    s3: {
      buckets: {
        animaltoolsImages: {
          region: string
          name: string
        }
      }
    }
  }
} = { credentials: { accessKeyId, secretAccessKey }, services: servicesConfig }

export default awsConfig
