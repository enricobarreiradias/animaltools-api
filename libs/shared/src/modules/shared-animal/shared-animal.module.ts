import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { Lot } from '@lib/data/entities/animaltools/lot.entity'
import { AnimalHandling } from '@lib/data/entities/animaltools/animal-handling.entity'
import { Animal } from '@lib/data/entities/animaltools/animal.entity'
import { Handling } from '@lib/data/entities/animaltools/handling.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lot, Handling, AnimalHandling, Animal])]
})
export class SharedAnimalModule {}
