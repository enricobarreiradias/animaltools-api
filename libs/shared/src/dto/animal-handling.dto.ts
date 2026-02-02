import { Field, Float, Int } from "@nestjs/graphql"
import { GraphqlDtoBase } from "../graphql/graphqlDtoBase"
import { QueryField } from "../graphql/queryField.decorator"

export class AnimalHandlingDto extends GraphqlDtoBase {
    @Field(type => Int)
    @QueryField()
    animalId: number
  
    @Field(type => Int)
    @QueryField()
    handlingId: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    withersHeight?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    ribDepth?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    thoracicPerimeter?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    rumpHeight?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    rumpWidth?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    bodyLenght?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    termiteHeight?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    termiteLength?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    termiteWidth?: number
  
    @Field({ nullable: true })
    @QueryField()
    visualTermite?: string
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    ecc: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    frame?: number
  
    @Field({ nullable: true })
    @QueryField()
    observation?: string
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    aol?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    egs?: number
  
    @Field(type => Float, { nullable: true })
    @QueryField()
    egp?: number
  
    @Field(type => Int, { nullable: true })
    @QueryField()
    entrySequence?: number
  }
  