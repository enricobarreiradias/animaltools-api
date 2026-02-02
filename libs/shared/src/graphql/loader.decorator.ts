import { createParamDecorator, InternalServerErrorException, ExecutionContext } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { DataLoaderInterceptor, GET_LOADER_CONTEXT_KEY } from './dataloader.interceptor'

export const Loader: (type: string) => ParameterDecorator = createParamDecorator(
  (type: string, ectx: ExecutionContext) => {
    const [__, ___, ctx, ____] = ectx.getArgs()
    if (ctx[GET_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(`
        You should provide interceptor ${DataLoaderInterceptor.name} globaly with ${APP_INTERCEPTOR}
      `)
    }

    return ctx[GET_LOADER_CONTEXT_KEY](type)
  }
)
