const queryFieldMetadataKey = Symbol('QueryField')
const dataLoaderResultMetadataKey = Symbol('dataLoaderResult')

const CACHE_PERMISSIONS_BY_FEEDLOT = String('feedlotAuthPermissions')
const CACHE_PERMISSIONS = String('authPermissions')
const CACHE_ACTIVE_LOTS = String('activeLots')

const CACHE_PERMISSIONS_INTEGRATION_BY_FEEDLOT = String('feedlotIntegrationAuthPermission')
const CACHE_PERMISSIONS_INTEGRATION = String('authPermissionsIntegration')
const CACHE_LOTS_INTEGRATION = String('lotsIntegration')

const AUTH_SESSION = String('authSession')
const AUTH = String('auth')

const AUTH_SESSION_INTEGRATION = String('authSession')
const AUTH_INTEGRATION = String('auth')

export {
  queryFieldMetadataKey,
  dataLoaderResultMetadataKey,
  CACHE_PERMISSIONS_BY_FEEDLOT,
  CACHE_PERMISSIONS,
  CACHE_ACTIVE_LOTS,
  CACHE_PERMISSIONS_INTEGRATION_BY_FEEDLOT,
  CACHE_PERMISSIONS_INTEGRATION,
  CACHE_LOTS_INTEGRATION,
  AUTH_SESSION,
  AUTH,
  AUTH_SESSION_INTEGRATION,
  AUTH_INTEGRATION
}
