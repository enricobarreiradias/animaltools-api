import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository, InjectConnection } from '@nestjs/typeorm'
import { Lot } from '@lib/data/entities/animaltools/lot.entity'
import { Repository, Connection } from 'typeorm'
import { Animal } from '@lib/data/entities/animaltools/animal.entity'
import { CreateAnimalDto, UpdateAnimalDto } from '@lib/shared/dto/animal.dto'
import { Handling } from '@lib/data/entities/animaltools/handling.entity'
import { CreateHandlingDto } from '@lib/shared/dto/handling.dto'
import * as _ from 'lodash'
import { AnimalHandlingDto } from '@lib/shared/dto/animal-handling.dto'
import { AnimalHandling } from '@lib/data/entities/animaltools/animal-handling.entity'
import { Pen } from '@lib/data/entities/animaltools/pen.entity'
import { GrossWeighing } from '@lib/data/entities/animaltools-analytics/gross-weighing.entity'

@Injectable()
export class SharedAnimalService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Animal) private animalRepository: Repository<Animal>,
    @InjectRepository(Lot) private lotRepository: Repository<Lot>,
    @InjectRepository(Pen) private penRepository: Repository<Pen>,
    @InjectRepository(Handling) private handlingRepository: Repository<Handling>,
    @InjectRepository(AnimalHandling) private animalHandlingRepository: Repository<AnimalHandling>,
    @InjectRepository(GrossWeighing, 'animaltoolsAnalytics') private grossWeighingRepository: Repository<GrossWeighing>
  ) {}

  private async getExistingLot(lotId: number): Promise<Lot> {
    return this.lotRepository.findOne({ where: { id: lotId } })
  }

  private async getExistingAnimal(lotId: number, id: number): Promise<Animal> {
    return this.animalRepository.findOne({ where: { id: id, lotId: lotId } })
  }

  private async getExistingHandling(lotId: number): Promise<Handling> {
    return this.handlingRepository.findOne({ where: { lotId: lotId } })
  }

  private async getExistingFeedlotLot(lotId: number, newLotId: number): Promise<boolean> {
    const lot = await this.lotRepository.findOne({ where: { id: lotId } })
    let pen: Pen
    if (lot.penId) pen = await this.penRepository.findOne({ where: { id: lot.penId } })
    const newLot = await this.lotRepository.findOne({ where: { id: newLotId } })
    let newPen: Pen
    if (newLot.penId) newPen = await this.penRepository.findOne({ where: { id: newLot.penId } })
    if (pen?.feedlotId !== newPen?.feedlotId) return false
    else return true
  }

  private async getAnimalHandling(animalId: number): Promise<AnimalHandling> {
    return this.animalHandlingRepository.findOne({ where: { animalId } })
  }

  async createAnimal(
    lotId: number,
    animalsDto: CreateAnimalDto[],
    userType: 'admin' | 'app',
    userId?: number
  ): Promise<number[]> {
    const lot = await this.getExistingLot(lotId)
    let handlingId: number | null = null
    const animalsHandlingDto = []
    if (!lot) {
      throw new ConflictException('This lot does not exists')
    }

    const createdAnimalIds = []

    const handling = await this.getExistingHandling(lotId)
    handlingId = handling?.id
    if (!handling) {
      const handlingDto = new CreateHandlingDto()
      handlingDto.feedlotId = lot.feedlotId
      handlingDto.lotId = lot.id
      handlingDto.penId = lot.penId
      handlingDto.startDate = lot.initDate
      handlingDto.endDate = lot.initDate
      handlingId = (await this.handlingRepository.save(this.handlingRepository.create(handlingDto))).id
    }

    await this.connection.transaction(async entityManager => {
      for (let i = 0; i < animalsDto.length; i++) {
        let animal: any = animalsDto[i]
        animal = this.animalRepository.create(animal)
        animal.lotId = lotId
        if (userType === 'app') animal.userId = userId
        const animalId = (await this.animalRepository.save(animal)).id
        createdAnimalIds.push(animalId)

        const animalHandlingDto = new AnimalHandlingDto()
        animalHandlingDto.animalId = animalId
        animalHandlingDto.handlingId = handlingId
        animalHandlingDto.ecc = animalsDto[i].eccHandling
        animalsHandlingDto.push()
        await this.animalHandlingRepository.save(this.animalHandlingRepository.create(animalHandlingDto))
      }
    })

    return createdAnimalIds
  }

  async updateAnimal(lotId: number, animalDto: UpdateAnimalDto[]): Promise<number[]> {
    const lot = await this.getExistingLot(lotId)
    const updatedAnimalIds: number[] = []
    const animalsHandlingDto = []

    if (!lot) {
      throw new ConflictException('This lot does not exists')
    }

    await Promise.all(
      _.map(animalDto, async a => {
        if (!(await this.getExistingAnimal(lotId, a.id))) {
          throw new ConflictException('This animal does not exists on this lot')
        }
      })
    )

    const handling = await this.getExistingHandling(lotId)

    for (let i = 0; i < animalDto.length; i++) {
      let animal: any = animalDto[i]
      animal = this.animalRepository.create(animal)
      animal.lotId = lotId
      animal.penId = lot.penId
      const animalHandlingDto = new AnimalHandlingDto()
      animalHandlingDto.animalId = animal.id
      animalHandlingDto.handlingId = handling.id
      animalHandlingDto.ecc = animalDto[i].eccHandling
      animalsHandlingDto.push()
      await this.animalHandlingRepository.save(this.animalHandlingRepository.create(animalHandlingDto))

      const animalId = (await this.animalRepository.save(animal)).id
      updatedAnimalIds.push(animalId)
    }

    return updatedAnimalIds
  }

  async updateAnimalLot(lotId: number, newLotId: number, animalId: number[]): Promise<number> {
    const lot = await this.getExistingLot(lotId)
    const newLot = await this.getExistingLot(newLotId)
    let affectedAnimals = 0

    if (!lot) {
      throw new ConflictException('This lot does not exists')
    }

    if (!newLot) {
      throw new ConflictException('This new lot does not exists')
    }

    const newLotPen = await this.getExistingFeedlotLot(lotId, newLotId)
    if (!newLotPen) {
      throw new ConflictException('This new lot does not exists in this feedlot')
    }

    await Promise.all(
      _.map(animalId, async id => {
        if (!(await this.getExistingAnimal(lotId, id))) {
          throw new ConflictException('This animal does not exists on this lot')
        }
      })
    )

    await Promise.all(
      _.map(animalId, async id => {
        await this.grossWeighingRepository
          .createQueryBuilder()
          .update()
          .set({
            weighing: () => {
              return "jsonb_set(pesagem, '{idLote}'," + "'" + newLotId + "'" + ')'
            }
          })
          .where("(weighing ->> 'idAnimal')::INT IN (:animalId)", { animalId: id })
          .execute()
      })
    )

    let newHandling = await this.getExistingHandling(newLotId)
    if (!newHandling) {
      const newHandlingDto = new CreateHandlingDto()
      newHandlingDto.feedlotId = newLot.feedlotId
      newHandlingDto.lotId = newLot.id
      newHandlingDto.penId = newLot.penId
      newHandlingDto.startDate = new Date()
      newHandlingDto.endDate = new Date()

      newHandling = await this.handlingRepository.save(this.handlingRepository.create(newHandlingDto))
    }

    for (let i = 0; i < animalId.length; i++) {
      let animalHandling = await this.getAnimalHandling(animalId[i])
      animalHandling.handlingId = newHandling.id

      await this.animalHandlingRepository.save(this.animalHandlingRepository.create(animalHandling))

      await this.animalRepository
        .createQueryBuilder()
        .update()
        .set({ lotId: newLotId, penId: newLot.penId })
        .where(`id = ${animalId[i]}`)
        .execute()

      affectedAnimals++
    }

    return affectedAnimals
  }
}
