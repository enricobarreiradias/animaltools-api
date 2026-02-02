import { MaxLength } from 'class-validator'
import { Field, ObjectType, Int } from '@nestjs/graphql'
import { QueryField } from '../graphql/queryField.decorator'
import { GraphqlDtoBase } from '../graphql/graphqlDtoBase'

@ObjectType()
export class CountryDto extends GraphqlDtoBase {
  @Field(type => Int)
  @QueryField()
  id: number

  @Field()
  @QueryField()
  @MaxLength(50)
  description: string
}
