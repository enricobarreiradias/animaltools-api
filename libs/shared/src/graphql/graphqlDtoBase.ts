import { QueryFieldProperty } from '../interfaces/query-field-property.interface'

interface GetQueryFieldsOptions {
  tableAlias?: string
  path?: string
}

function getFieldsKeys(graphqlFields: string[] | Record<string, any>, path?: string): string[] {
  try {
    if (Array.isArray(graphqlFields)) return graphqlFields

    if (path) {
      const pathArray = path.split('.') ?? [path]
      const objPath = pathArray.reduce((pre, cur) => {
        return pre[cur]
      }, graphqlFields)

      return Object.keys(objPath)
    }

    return Object.keys(graphqlFields)
  } catch (error) {
    return []
  }
}

export class GraphqlDtoBase {
  private queryFields: QueryFieldProperty[]

  getQueryFields(graphqlFields: string[] | Record<string, any>, options?: GetQueryFieldsOptions): string[] {
    const requiredColumns = this.queryFields
      .filter(queryField => queryField.required === true)
      .map(queryField => queryField.alias ?? queryField.key)

    const selectedFields: string[] = requiredColumns

    for (const gqlField of getFieldsKeys(graphqlFields, options?.path)) {
      const queryFieldField = this.queryFields.find(ec => !ec.required && ec.key === gqlField)
      if (!queryFieldField) {
        continue
      }
      selectedFields.push(queryFieldField.alias ?? queryFieldField.key)
    }

    if (options?.tableAlias) {
      return selectedFields.map(field => `${options.tableAlias}.${field}`)
    }

    return selectedFields
  }

  fillFromEntity(queryFields: string[], entity: Record<string, any>) {
    queryFields.map(qf => {
      const queryFieldKey = this.queryFields.find(
        dtoQueryField => dtoQueryField.key === qf || dtoQueryField.alias === qf
      ).key
      this[queryFieldKey] = entity[qf]
    })
  }
}
