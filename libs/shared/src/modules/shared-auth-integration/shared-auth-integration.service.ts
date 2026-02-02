import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { AUTH_INTEGRATION, AUTH_SESSION_INTEGRATION } from '@lib/shared/symbols'
import { AuthSessionUserIntegrationExternalApi } from './shared-auth-integration.interface'

@Injectable()
export class SharedAuthIntegrationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  async getCacheAuthIntegrationSessionKey(cacheAuthIntegrationSessionKey: string): Promise<string[]> {
    const result: string[] = await this.cacheManager.keys(cacheAuthIntegrationSessionKey)
    return result
  }

  async delOldCacheAuthIntegrationSessionKeys(cacheAuthIntegrationKey: string): Promise<void> {
    const cacheAuthIntegrationKeys = await this.getCacheAuthIntegrationSessionKey(cacheAuthIntegrationKey)
    if (cacheAuthIntegrationKeys.length === 0) {
      return null
    }
    await this.cacheManager.del(cacheAuthIntegrationKeys)
  }

  async logoutSessionExternalApi(currentUserIntegration: Partial<AuthSessionUserIntegrationExternalApi>) {
    let cacheKeyIntegrationSession: string = null

    if (currentUserIntegration.credentialId) {
      cacheKeyIntegrationSession = `${AUTH_SESSION_INTEGRATION}:${currentUserIntegration.credentialId}`
    } else throw new InternalServerErrorException('Missing User Integration')

    await this.delOldCacheAuthIntegrationSessionKeys(cacheKeyIntegrationSession)
  }
  async logoutExternalApi(currentUserIntegration: Partial<AuthSessionUserIntegrationExternalApi>) {
    let cacheKeySession: string = null

    if (currentUserIntegration.credentialId) {
      cacheKeySession = `${AUTH_INTEGRATION}:${currentUserIntegration.credentialId}`
    } else throw new InternalServerErrorException('Missing User')

    await this.delOldCacheAuthIntegrationSessionKeys(cacheKeySession)
  }
}
