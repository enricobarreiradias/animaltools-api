import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common'
import {
  CACHE_PERMISSIONS_INTEGRATION_BY_FEEDLOT,
  CACHE_LOTS_INTEGRATION,
  CACHE_PERMISSIONS_INTEGRATION
} from '@lib/shared/symbols'
import {
  AuthPermissionsIntegrationDto,
  FeedlotAuthPermissionsIntegrationDto
} from './dto/shared-auth-permissions-integration.dto'

@Injectable()
export class SharedAuthPermissionIntegrationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  makeCacheAuthPermissionsIntegrationByFeedlot(
    feedlotId: number,
    userIntegrationId?: number,
    permissions?: FeedlotAuthPermissionsIntegrationDto
  ): { key: string; value: string } {
    if (userIntegrationId)
      return {
        key: `${CACHE_PERMISSIONS_INTEGRATION_BY_FEEDLOT}:${feedlotId}:${userIntegrationId}`,
        value: JSON.stringify(permissions)
      }
    else
      return {
        key: `${CACHE_PERMISSIONS_INTEGRATION_BY_FEEDLOT}:${feedlotId}:*`,
        value: JSON.stringify(permissions)
      }
  }

  makeCacheLotsIntegration(feedlotId?: number, lots?: number[]): { key: string; value: string } {
    if (feedlotId)
      return {
        key: `${CACHE_LOTS_INTEGRATION}:${feedlotId}`,
        value: JSON.stringify(lots)
      }
    else
      return {
        key: `${CACHE_LOTS_INTEGRATION}:*`,
        value: JSON.stringify(lots)
      }
  }

  makeCacheAuthPermissionsIntegration(
    userIntegrationId: number,
    authPermissions?: AuthPermissionsIntegrationDto[]
  ): { key: string; value: string } {
    return {
      key: `${CACHE_PERMISSIONS_INTEGRATION}:${userIntegrationId}`,
      value: JSON.stringify(authPermissions)
    }
  }

  private async getCachePermissionIntegrationByKey(cacheAuthKey: string): Promise<string[]> {
    const result: string[] = await this.cacheManager.keys(cacheAuthKey)
    return result
  }

  async delCache(cacheAuthKey: string): Promise<void> {
    const cacheAuthKeys = await this.getCachePermissionIntegrationByKey(cacheAuthKey)
    if (cacheAuthKeys.length === 0) {
      return null
    }
    await this.cacheManager.del(cacheAuthKeys)
  }
}
