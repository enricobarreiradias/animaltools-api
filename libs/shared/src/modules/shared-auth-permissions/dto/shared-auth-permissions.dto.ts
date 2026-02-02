import { UserPermissionsField } from '@lib/data/entities/animaltools/interfaces/user-permissions-field.interface'

export class FeedlotAuthPermissionsDto {
  permissions: UserPermissionsField
  pens: number[]
  lots: number[]
}
export class AuthPermissionsDto {
  feedlots: number[]
}
