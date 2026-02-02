import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository, InjectConnection } from '@nestjs/typeorm'
import { Lot } from '@lib/data/entities/animaltools/lot.entity'
import { Repository, Connection } from 'typeorm'
import { Pen } from '@lib/data/entities/animaltools/pen.entity'
import { Feedlot } from '@lib/data/entities/animaltools/feedlot.entity'
import { Animal } from '@lib/data/entities/animaltools/animal.entity'
import * as shorthash from 'shorthash'

@Injectable()
export class SharedLotService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Animal) private animalRepository: Repository<Animal>,
    @InjectRepository(Lot) private lotRepository: Repository<Lot>,
    @InjectRepository(Feedlot) private feedlotRepository: Repository<Feedlot>,
    @InjectRepository(Pen) private penRepository: Repository<Pen>
  ) {}

  private async getExistingLot(lotId): Promise<Lot> {
    return this.lotRepository.findOne({ select: ['id'], where: { id: lotId } })
  }

  private async getExistingFeedlot(feedlotId): Promise<Feedlot> {
    return this.feedlotRepository.findOne({ select: ['id'], where: { id: feedlotId } })
  }

  private async getExistingPen(penId): Promise<Pen> {
    return this.penRepository.findOne({ select: ['id'], where: { id: penId } })
  }

  private setHashLot(lotId: number): string {
    let value = String(lotId) + Date.now().toString()
    var hash = shorthash.unique(value)
    return String(hash)
  }

  async createLot(lot: Lot, status: boolean, userType: 'admin' | 'app', userId?: number): Promise<Lot> {
    if (!(await this.getExistingFeedlot(lot.feedlotId))) {
      throw new ConflictException('This feedlot does not exist')
    }

    if (!(await this.getExistingPen(lot.penId))) {
      throw new ConflictException('This pen does not exist')
    }

    try {
      if (userType == 'admin') {
        lot.userAdminId = userId
      } else if (userType == 'app') {
        lot.userId = userId
      }

      lot.lotHash = this.setHashLot(lot.id)
      lot.registerStatus = status

      return await this.connection.transaction(async entityManager => {
        const newLot = await entityManager.save<Lot>(lot)
        return newLot
      })
    } catch (err) {
      throw new InternalServerErrorException()
    }
  }

  async updateAnimalStatus(lotId: number): Promise<void> {
    await this.animalRepository
      .createQueryBuilder('a')
      .update()
      .set({ active: false })
      .where('lotId = :lotId', { lotId: lotId })
      .execute()
  }

  async updateLot(lot: Lot): Promise<Lot> {
    if (!(await this.getExistingLot(lot.id))) {
      throw new ConflictException('This lot does not exist')
    }
    if (lot.feedlotId) {
      if (!(await this.getExistingFeedlot(lot.feedlotId))) {
        throw new ConflictException('This feedlot does not exist')
      }
    }

    if (lot.penId) {
      if (!(await this.getExistingPen(lot.penId))) {
        throw new ConflictException('This pen does not exist')
      }
    }

    if (lot.endDate) await this.updateAnimalStatus(lot.id)

    try {
      return await this.connection.transaction(async entityManager => {
        const updatedLot = await entityManager.save<Lot>(lot)
        return updatedLot
      })
    } catch (err) {
      throw new InternalServerErrorException()
    }
  }

  async validateLot(lot: Lot, user) {
    lot.userAdminId = user.userId
    console.log('lot: ', lot)
    if (!(await this.getExistingLot(lot.id))) {
      throw new ConflictException('This lot does not exist')
    }

    try {
      return await this.connection.transaction(async entityManager => {
        const validateLot = await entityManager.save<Lot>(lot)
        return validateLot
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
