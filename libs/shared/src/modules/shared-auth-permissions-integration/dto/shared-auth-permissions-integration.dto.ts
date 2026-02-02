import { UserPermissionsIntegrationField } from '@lib/data/entities/animaltools/interfaces/user-permissions-integration-field.interface'
export class FeedlotAuthPermissionsIntegrationDto {
  permissions: UserPermissionsIntegrationField
}
export class AuthPermissionsIntegrationDto {
  feedlotId?: number
  permissions?: UserPermissionsIntegrationField
}
