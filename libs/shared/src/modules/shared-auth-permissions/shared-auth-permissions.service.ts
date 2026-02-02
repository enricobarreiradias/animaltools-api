import { CACHE_ACTIVE_LOTS, CACHE_PERMISSIONS, CACHE_PERMISSIONS_BY_FEEDLOT } from '@lib/shared/symbols'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { FeedlotAuthPermissionsDto, AuthPermissionsDto } from './dto/shared-auth-permissions.dto'

@Injectable()
export class SharedAuthPermissionService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) {}

  makeCacheAuthPermissionsByFeedlot(
    feedlotId: number,
    userId?: number,
    permissions?: FeedlotAuthPermissionsDto
  ): { key: string; value: string } {
    if (userId)
      return {
        key: `${CACHE_PERMISSIONS_BY_FEEDLOT}:${feedlotId}:${userId}`,
        value: JSON.stringify(permissions)
      }
    else
      return {
        key: `${CACHE_PERMISSIONS_BY_FEEDLOT}:${feedlotId}:*`,
        value: JSON.stringify(permissions)
      }
  }

  makeCacheActiveLots(feedlotId?: number, lots?: number[][]): { key: string; value: string } {
    if (feedlotId)
      return {
        key: `${CACHE_ACTIVE_LOTS}:${feedlotId}`,
        value: JSON.stringify(lots)
      }
    else
      return {
        key: `${CACHE_ACTIVE_LOTS}:*`,
        value: JSON.stringify(lots)
      }
  }

  makeCacheAuthPermissions(userId: number, authPermissions?: AuthPermissionsDto): { key: string; value: string } {
    return {
      key: `${CACHE_PERMISSIONS}:${userId}`,
      value: JSON.stringify(authPermissions)
    }
  }

  private async getCachePermissionByKey(cacheAuthKey: string): Promise<string[]> {
    const result: string[] = await this.cacheManager.keys(cacheAuthKey)
    return result
  }

  async delCache(cacheAuthKey: string): Promise<void> {
    const cacheAuthKeys = await this.getCachePermissionByKey(cacheAuthKey)
    if (cacheAuthKeys.length === 0) {
      return null
    }
    await this.cacheManager.del(cacheAuthKeys)
  }
}
