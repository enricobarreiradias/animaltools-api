import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { Lot } from '@lib/data/entities/animaltools/lot.entity'
import { Pen } from '@lib/data/entities/animaltools/pen.entity'
import { Feedlot } from '@lib/data/entities/animaltools/feedlot.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lot, Pen, Feedlot])]
})
export class SharedLotModule {}
