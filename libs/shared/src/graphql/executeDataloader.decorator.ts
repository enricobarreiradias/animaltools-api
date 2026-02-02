import { GraphqlDtoBase } from './graphqlDtoBase'
import { GraphQLObjectType } from 'graphql'
import { dataLoaderResultMetadataKey } from '../symbols'
import { GraphqlUtils } from '../providers/utils/graphql'
import DataLoader = require('dataloader')

/**
 * Execute DataLoader function of `@Loader` parameter decorator and set result into @DataLoaderResult parameter decorator
 * @param ReturnType Return type of `@ResolveField` decorator
 * @param parentKey Key(s) of `@Parent` decorator type
 */
export function ExecuteDataloader<T>(
  ReturnType: {
    new (): T
  },
  parentKey: string | string[]
) {
  return function(target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = async function(...args: any[]) {
      const authUser = args.find(a => a._type === 'authUser')
      const resolvePropertyArgs = args.find(a => a._type === 'ResolvePropertyArgsPipe')
      const parentDto = args.find(a => a instanceof GraphqlDtoBase)
      const dataLoader = args.find(a => a instanceof DataLoader)
      const dataLoaderResultParam: number = Reflect.getOwnMetadata(dataLoaderResultMetadataKey, target, key)

      if (!parentDto) {
        throw new Error(`Parent parameter decorator not set for ${key}`)
      }
      if (!dataLoader) {
        throw new Error(`Loader parameter decorator not set for ${key}`)
      }
      if (!dataLoaderResultParam) {
        throw new Error(`DataLoaderResult parameter decorator not set for ${key}`)
      }

      let dataLoaderKeyData: {
        parentKey: any
        gqlQueryFields?: Record<string, any>
        queryFields?: string[]
        authUser?: any
        args?: any
      } = { parentKey: null }

      dataLoaderKeyData.parentKey = Array.isArray(parentKey) ? parentKey.map(pk => parentDto[pk]) : parentDto[parentKey]

      if (dataLoader['_batch'] === null) {
        const gqlQueryInfo = args.find(a => a.parentType instanceof GraphQLObjectType)

        if (gqlQueryInfo) {
          const gqlFields = new GraphqlUtils().getGraphqlFields(gqlQueryInfo)

          if (ReturnType.prototype instanceof GraphqlDtoBase) {
            dataLoaderKeyData.queryFields = ((new ReturnType() as unknown) as GraphqlDtoBase).getQueryFields(
              Object.keys(gqlFields)
            )
          }

          dataLoaderKeyData.gqlQueryFields = gqlFields
        }

        if (authUser) {
          dataLoaderKeyData.authUser = authUser
        }

        if (resolvePropertyArgs) {
          dataLoaderKeyData.args = resolvePropertyArgs
        }
      }

      const loaderResult = await dataLoader.load({
        ...dataLoaderKeyData
      })

      args[dataLoaderResultParam] = loaderResult
      const result = original.apply(this, args)
      return result
    }
    return descriptor
  }
}
