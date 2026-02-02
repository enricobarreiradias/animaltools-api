import { Field, ObjectType, Int } from '@nestjs/graphql'
import { QueryField } from '../graphql/queryField.decorator'
import { GraphqlDtoBase } from '../graphql/graphqlDtoBase'

@ObjectType()
export class AddressDto extends GraphqlDtoBase {
  @Field(type => Int, { nullable: true })
  @QueryField()
  countryId: number

  @Field({ nullable: true })
  @QueryField()
  countryDescription: string

  @Field(type => Int, { nullable: true })
  @QueryField()
  stateId: number

  @Field({ nullable: true })
  @QueryField()
  stateDescription: string

  @Field(type => Int, { nullable: true })
  @QueryField()
  cityId: number

  @Field({ nullable: true })
  @QueryField()
  cityDescription: string

  @Field({ nullable: true })
  @QueryField()
  cityStateDescription: string
}
