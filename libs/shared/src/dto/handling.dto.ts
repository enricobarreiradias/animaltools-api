import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class CreateHandlingDto {
  @Field(type => Int)
  feedlotId: number

  @Field(type => Int)
  lotId: number

  @Field(type => Int)
  penId: number

  @Field(type => Date, { nullable: true })
  startDate?: Date

  @Field(type => Date, { nullable: true })
  endDate?: Date

  @Field({ nullable: true })
  note?: string

  @Field(type => Int, { nullable: true })
  handlingCode?: string
}
