import { Injectable } from '@nestjs/common'
import * as graphqlFields from 'graphql-fields'
import { GraphqlDtoBase } from '../../graphql/graphqlDtoBase'

@Injectable()
export class GraphqlUtils {
  getGraphqlFields(info: any) {
    return graphqlFields(info, {}, { excludedFields: ['__typename'] })
  }

  static createDtosFromEntities<T extends GraphqlDtoBase>(
    Dto: {
      new (): T
    },
    entities: Record<string, any> | Record<string, any>[],
    queryFields?: string[]
  ): T[] {
    const _entities: any[] = Array.isArray(entities) ? entities : [entities]
    const entityFields = queryFields ?? Object.keys(_entities[0])
    const dto = new Dto()

    const requestQueryFields = dto['queryFields'].filter(qf => entityFields.indexOf(qf.alias ?? qf.key) >= 0)

    const result = _entities.map(entity => {
      const dto = new Dto()
      requestQueryFields.map(qf => {
        dto[qf.key] = entity[qf.alias ?? qf.key]
      })
      return dto
    })

    return result
  }
}
