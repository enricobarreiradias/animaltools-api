import { AUTH_SESSION, AUTH } from '@lib/shared/symbols'
import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { AuthSessionUserApp } from './shared-auth.interface'

@Injectable()
export class SharedAuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  async getCacheAuthSessionKey(cacheAuthSessionKey: string): Promise<string[]> {
    const result: string[] = await this.cacheManager.keys(cacheAuthSessionKey)
    return result
  }

  async delOldCacheAuthSessionKeys(cacheAuthKey: string): Promise<void> {
    const cacheAuthKeys = await this.getCacheAuthSessionKey(cacheAuthKey)
    if (cacheAuthKeys.length === 0) {
      return null
    }
    await this.cacheManager.del(cacheAuthKeys)
  }

  async logoutSessionApp(currentUser: Partial<AuthSessionUserApp>) {
    let cacheKeySession: string = null

    if (currentUser.userId) {
      if (currentUser.env !== null && currentUser.app !== null)
        cacheKeySession = `${AUTH_SESSION}:${currentUser.userId}:${currentUser.app}:${currentUser.env}`
      else if (currentUser.app !== null) cacheKeySession = `${AUTH_SESSION}:${currentUser.userId}:${currentUser.app}:*`
      else cacheKeySession = `${AUTH_SESSION}:${currentUser.userId}:*`
    } else throw new InternalServerErrorException('Missing User')

    await this.delOldCacheAuthSessionKeys(cacheKeySession)
  }
  async logoutApp(currentUser: Partial<AuthSessionUserApp>) {
    let cacheKeySession: string = null

    if (currentUser.userId) {
      if (currentUser.env !== null && currentUser.app !== null)
        cacheKeySession = `${AUTH}:${currentUser.userId}:${currentUser.app}:${currentUser.env}`
      else if (currentUser.app !== null) cacheKeySession = `${AUTH}:${currentUser.userId}:${currentUser.app}:*`
      else cacheKeySession = `${AUTH}:${currentUser.userId}:*`
    } else throw new InternalServerErrorException('Missing User')

    await this.delOldCacheAuthSessionKeys(cacheKeySession)
  }
}
