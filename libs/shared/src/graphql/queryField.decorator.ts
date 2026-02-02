import { queryFieldMetadataKey } from '../symbols'
import { QueryFieldProperty } from '../interfaces/query-field-property.interface'
import { QueryFieldOptions } from '../interfaces/query-field-options.interface'

const queryFieldsPropertyName = 'queryFields'

export function QueryField(options?: QueryFieldOptions): any {
  return (target: Record<string, any>, key: string) => {
    Reflect.defineMetadata(queryFieldMetadataKey, options, target, key)

    const queryFields: QueryFieldProperty[] = target[queryFieldsPropertyName] || []

    if (!queryFields.some(f => f.key === key)) {
      queryFields.push({ key, ...options })
    }

    Object.defineProperty(target, queryFieldsPropertyName, {
      get: () => {
        return queryFields
      },
      enumerable: true,
      configurable: true
    })
  }
}
