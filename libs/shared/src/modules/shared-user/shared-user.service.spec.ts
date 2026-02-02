import { Test, TestingModule } from '@nestjs/testing'
import { SharedUserService } from './shared-user.service'
import { Repository, Connection } from 'typeorm'
import { User } from '@lib/data/entities/animaltools/user.entity'
import { Utils } from '@lib/shared/providers/utils'
import { ConflictException } from '@nestjs/common'
import { UserRepository } from '@lib/data/repos/animaltools/user.repository'

const mockConnection = () => ({
  transaction: jest.fn(async () => null)
})

const mockUserRepository = () => ({
  findOne: jest.fn(),
  addNewUserToFeedlot: jest.fn(() => ({ id: 1, email: 'ti@techagr.com' })),
  addExistingUserToFeedlot: jest.fn(() => ({ id: 1, email: 'ti@techagr.com' }))
})

const mockUserPenRepository = () => ({
  findOne: jest.fn()
})

const mockUserLotRepository = () => ({
  findOne: jest.fn()
})

const mockPenRepository = () => ({
  findOne: jest.fn()
})

const mockLotRepository = () => ({
  findOne: jest.fn()
})

const mockCacheManager = () => ({
  keys: jest.fn(async () => null),
  set: jest.fn(async () => null),
  del: jest.fn(async () => null)
})

describe('SharedUserService', () => {
  let service: SharedUserService
  let userRepository: UserRepository
  let utils: Utils

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedUserService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: 'UserPenRepository', useFactory: mockUserPenRepository },
        { provide: 'UserLotRepository', useFactory: mockUserLotRepository },
        { provide: 'PenRepository', useFactory: mockUserPenRepository },
        { provide: 'LotRepository', useFactory: mockUserLotRepository },
        { provide: 'CACHE_MANAGER', useFactory: mockCacheManager },
        Utils
      ]
    }).compile()

    service = module.get<SharedUserService>(SharedUserService)
    userRepository = module.get<UserRepository>(UserRepository)
    utils = module.get<Utils>(Utils)
  })

  describe('addNewUserToFeedlot', () => {
    it('create and return new user', async () => {
      const newUserDb = new User()
      newUserDb.id = 1
      newUserDb.email = 'ti@techagr.com'

      jest.spyOn(service, 'sendUserSignUpEmail').mockResolvedValue(null)
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

      const result = await service.addNewUserToFeedlot(1, 'ti@techagr.com', { permissions: {}, pens: [], lots: [] })
      expect(result).not.toBeNull()
    })

    it('throws an error if user already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User())

      await expect(
        service.addNewUserToFeedlot(1, 'ti@techagr.com', { permissions: {}, pens: [], lots: [] })
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('addExistingUserToFeedlot', () => {
    it("throws an error if user don't exists", async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

      await expect(service.addExistingUserToFeedlot(1, 1, { permissions: {}, pens: [], lots: [] })).rejects.toThrow(
        ConflictException
      )
    })
  })

  describe('alterUser', () => {
    const updatedUser = new User()
    updatedUser.id = 1
    updatedUser.email = 'ti@techagr.com'

    it("throws an error if user don't exists", async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

      await expect(service.alterUser(1, updatedUser, { permissions: {}, pens: [], lots: [] })).rejects.toThrow(
        ConflictException
      )
    })

    it('throws an error if user email already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User())

      await expect(service.alterUser(1, updatedUser, { permissions: {}, pens: [], lots: [] })).rejects.toThrow(
        ConflictException
      )
    })
  })

  describe('sendUserSignUpEmail', () => {
    it('send e-mail to new user', async () => {
      const newUser = new User()
      newUser.id = 1
      newUser.email = 'ti@techagr.com'

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(newUser)
      jest.spyOn(utils, 'sendEmail').mockResolvedValue({ response: 'ok' })

      const result = await service.sendUserSignUpEmail(1)
      expect(result).not.toBeNull()
    })

    it("throws an error if user don't exists", async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)
      jest.spyOn(utils, 'sendEmail').mockResolvedValue({ response: 'ok' })

      await expect(service.sendUserSignUpEmail(1)).rejects.toThrow(ConflictException)
    })
  })
})
