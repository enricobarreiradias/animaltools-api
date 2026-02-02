import { Field, Float, InputType, Int } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
@InputType()
export class CreateAnimalDto {
  @Field(type => Int)
  lotId: number

  @Field(type => Int)
  penId: number

  @Field(type => Int)
  feedlotId: number

  @Field()
  earring: string

  @Field(type => Int)
  breedId: number

  @Field(type => Int)
  genderId: number

  @Field(type => Int)
  coatId: number

  @Field(type => Int, { nullable: true })
  age?: number

  @Field(type => Boolean, { nullable: true })
  active?: boolean

  @Field({ nullable: true })
  tag?: string

  @Field({ nullable: true })
  horn?: string

  @Field(type => Float, { nullable: true })
  initialWeight?: number

  @Field(type => Float, { nullable: true })
  finalWeight?: number

  @Field(type => Date, { nullable: true })
  endDate?: Date

  @Field({ nullable: true })
  note?: string

  @Field({ nullable: true })
  sisbov?: string

  @Field(type => Date, { nullable: true })
  lastWeighingDate?: Date

  @Field(type => Float, { nullable: true })
  ecc?: number

  @Field(type => Int, { nullable: true })
  userId?: number

  @Field(type => GraphQLJSON, { nullable: true })
  additionalField?: JSON

  @Field(type => Float, { nullable: true })
  withersHeight?: number

  @Field(type => Float, { nullable: true })
  ribDepth?: number

  @Field(type => Float, { nullable: true })
  thoracicPerimeter?: number

  @Field(type => Float, { nullable: true })
  rumpHeight?: number

  @Field(type => Float, { nullable: true })
  rumpWidth?: number

  @Field(type => Float, { nullable: true })
  bodyLength?: number

  @Field(type => Float, { nullable: true })
  termiteHeight?: number

  @Field(type => Float, { nullable: true })
  termiteLength?: number

  @Field(type => Float, { nullable: true })
  termiteWidth?: number

  @Field(type => Float, { nullable: true })
  visualTermite?: number

  @Field(type => Float)
  eccHandling?: number

  @Field(type => Float, { nullable: true })
  frame?: number

  @Field(type => String, { nullable: true })
  observation?: string

  @Field(type => Float, { nullable: true })
  aol?: number

  @Field(type => Float, { nullable: true })
  egp?: number

  @Field(type => Float, { nullable: true })
  egs?: number

  @Field(type => Float, { nullable: true })
  entrySequence?: number
}

@InputType()
export class UpdateAnimalDto {
  @Field(type => Int)
  id: number

  @Field(type => Int, { nullable: true })
  newLotId?: number

  @Field({ nullable: true })
  earring?: string

  @Field(type => Int)
  breedId: number

  @Field(type => Int)
  genderId: number

  @Field(type => Int)
  coatId: number

  @Field(type => Int, { nullable: true })
  age?: number

  @Field(type => Boolean, { nullable: true })
  active?: boolean

  @Field({ nullable: true })
  tag?: string

  @Field({ nullable: true })
  horn?: string

  @Field(type => Float, { nullable: true })
  initialWeight?: number

  @Field(type => Float, { nullable: true })
  finalWeight?: number

  @Field(type => Date, { nullable: true })
  endDate?: Date

  @Field({ nullable: true })
  note?: string

  @Field({ nullable: true })
  sisbov?: string

  @Field(type => Date, { nullable: true })
  lastWeighingDate?: Date

  @Field(type => Float, { nullable: true })
  ecc?: number

  @Field(type => Float, { nullable: true })
  eccHandling?: number

  @Field(type => GraphQLJSON, { nullable: true })
  additionalField?: JSON
}
