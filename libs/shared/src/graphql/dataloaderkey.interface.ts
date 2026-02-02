export interface DataLoaderKey {
  parentKey: any
  gqlQueryFields?: Record<string, any>
  queryFields?: string[]
  authUser?: any
  args?: any
}
