import { UserPermissionsField } from '@lib/data/entities/animaltools/interfaces/user-permissions-field.interface'
export interface UpdateUserPermissionsSet {
  permissions?: UserPermissionsField
  removedPens?: number[]
  removedLots?: number[]
  pens?: number[]
  lots?: number[]
}
