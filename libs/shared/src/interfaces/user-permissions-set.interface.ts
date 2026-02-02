import { UserPermissionsField } from '@lib/data/entities/animaltools/interfaces/user-permissions-field.interface'
export interface UserPermissionsSet {
  permissions: UserPermissionsField
  pens?: number[]
  lots?: number[]
}
