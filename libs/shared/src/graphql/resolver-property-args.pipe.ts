import { ArgumentMetadata, Injectable, PipeTransform, Scope } from '@nestjs/common'

@Injectable()
export class ResolvePropertyArgsPipe implements PipeTransform<any> {
  constructor() {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    return {
      _type: 'ResolvePropertyArgsPipe',
      ...value
    }
  }
}
