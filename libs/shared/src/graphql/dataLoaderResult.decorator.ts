import { dataLoaderResultMetadataKey } from '../symbols'

export function DataLoaderResult(target: Record<string, any>, propertyKey: string, parameterIndex: number) {
  let existingRequiredParameters = Reflect.getOwnMetadata(dataLoaderResultMetadataKey, target, propertyKey)
  if (existingRequiredParameters) {
    throw new Error(`DataLoaderResult declared more than once for ${propertyKey}`)
  }
  Reflect.defineMetadata(dataLoaderResultMetadataKey, parameterIndex, target, propertyKey)
}
