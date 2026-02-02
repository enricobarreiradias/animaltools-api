import { MaxLength } from 'class-validator'
import { GraphqlDtoBase } from '../graphql/graphqlDtoBase'
import { Field, ObjectType, Int } from '@nestjs/graphql'
import { QueryField } from '../graphql/queryField.decorator'

@ObjectType()
export class CityDto extends GraphqlDtoBase {
  @Field(type => Int)
  @QueryField()
  id: number

  @Field()
  @QueryField()
  @MaxLength(50)
  description: string
}
