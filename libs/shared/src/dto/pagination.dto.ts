import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class Pagination {
  @Field(type => Int)
  page?: number
  @Field(type => Int)
  take?: number
}
