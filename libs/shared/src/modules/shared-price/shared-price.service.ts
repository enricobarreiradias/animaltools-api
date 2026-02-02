import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository, InjectConnection } from '@nestjs/typeorm'
import { Price } from '@lib/data/entities/animaltools/price.entity'
import { Repository, Connection, EntityManager } from 'typeorm'
import { Currency } from '@lib/data/entities/animaltools/currency.entity'
import { Slaughterhouse } from '@lib/data/entities/animaltools/slaughterhouse.entity'
import { WeightUnity } from '@lib/data/entities/animaltools/weight-unity.entity'

@Injectable()
export class SharedPriceService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Price) private priceRepository: Repository<Price>,
    @InjectRepository(Slaughterhouse) private slaughterhouseRepository: Repository<Slaughterhouse>,
    @InjectRepository(Currency) private currencyRepository: Repository<Currency>,
    @InjectRepository(WeightUnity) private weightUnityRepository: Repository<WeightUnity>
  ) {}

  private async getExistingPrice(priceId): Promise<Price> {
    return this.priceRepository.findOne({ select: ['id'], where: { id: priceId } })
  }

  private async getExistingSlaughterhouse(slaughterhouseId): Promise<Slaughterhouse> {
    return this.slaughterhouseRepository.findOne({ select: ['id'], where: { id: slaughterhouseId } })
  }

  private async getExistingCurrency(currencyId): Promise<Currency> {
    return this.currencyRepository.findOne({ select: ['id'], where: { id: currencyId } })
  }

  private async getExistingWeightUnity(weightUnityId): Promise<WeightUnity> {
    return this.weightUnityRepository.findOne({ select: ['id'], where: { id: weightUnityId } })
  }

  async createPrice(price: Price): Promise<Price> {
    if (!(await this.getExistingSlaughterhouse(price.slaughterhouseId))) {
      throw new ConflictException('This slaughterhouse does not exist')
    }

    if (!(await this.getExistingCurrency(price.currencyId))) {
      throw new ConflictException('This currency does not exist')
    }

    if (!(await this.getExistingWeightUnity(price.weightUnityId))) {
      throw new ConflictException('This weight unity does not exist')
    }

    try {
      return await this.connection.transaction(async entityManager => {
        const newPrice = await entityManager.save<Price>(price)
        return newPrice
      })
    } catch (err) {
      throw new InternalServerErrorException()
    }
  }

  async updatePrice(price: Price): Promise<Price> {
    if (!(await this.getExistingPrice(price.id))) {
      throw new ConflictException('This price does not exist')
    }
    if (!(await this.getExistingSlaughterhouse(price.slaughterhouseId))) {
      throw new ConflictException('This slaughterhouse does not exist')
    }

    if (!(await this.getExistingCurrency(price.currencyId))) {
      throw new ConflictException('This currency does not exist')
    }

    if (!(await this.getExistingWeightUnity(price.weightUnityId))) {
      throw new ConflictException('This weight unity does not exist')
    }

    try {
      return await this.connection.transaction(async entityManager => {
        price.id = price.id.toString()
        const updatedPrice = await entityManager.save<Price>(price)
        return updatedPrice
      })
    } catch (err) {
      throw new InternalServerErrorException()
    }
  }
}
