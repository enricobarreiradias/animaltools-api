import * as config from 'config'

export default function getConfig(key: string): string {
  console.log('apiCredentialSecret', String(config.get(`apiCredentials.${key}`)))
  return String(config.get(`apiCredentials.${key}`))
}
