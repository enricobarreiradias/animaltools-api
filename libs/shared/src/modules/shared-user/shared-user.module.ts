import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MainCacheModule } from '@lib/data/main-cache.module'
import { SharedUserService } from './shared-user.service'
import { Utils } from '@lib/shared/providers/utils'
import { UserRepository } from '@lib/data/repos/animaltools/user.repository'
import { UserPen } from '@lib/data/entities/animaltools/user-pen.entity'
import { UserLot } from '@lib/data/entities/animaltools/user-lot.entity'
import { Lot } from '@lib/data/entities/animaltools/lot.entity'
import { Pen } from '@lib/data/entities/animaltools/pen.entity'
import { CustomerFeedlot } from '@lib/data/entities/animaltools/customer-feedlot.entity'
import { Feedlot } from '@lib/data/entities/animaltools/feedlot.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([UserPen]),
    TypeOrmModule.forFeature([UserLot]),
    TypeOrmModule.forFeature([Feedlot]),
    TypeOrmModule.forFeature([Pen]),
    TypeOrmModule.forFeature([Lot]),
    TypeOrmModule.forFeature([CustomerFeedlot]),
    MainCacheModule
  ],
  providers: [Utils, SharedUserService],
  exports: [SharedUserService]
})
export class SharedUserModule {}
