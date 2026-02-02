import { Injectable, Inject, ConflictException, CACHE_MANAGER, InternalServerErrorException } from '@nestjs/common'
import { Utils } from '../../providers/utils/index'
import * as config from 'config'
import * as crypto from 'crypto'
import { InjectRepository, InjectConnection } from '@nestjs/typeorm'
import { User } from '@lib/data/entities/animaltools/user.entity'
import { UpdateUserPermissionsSet } from '../../interfaces/update-user-permissions-set.interface'
import { UserPermissionsSet } from '../../interfaces/user-permissions-set.interface'
import { UserRepository } from '@lib/data/repos/animaltools/user.repository'
import { UserLot } from '@lib/data/entities/animaltools/user-lot.entity'
import { UserPen } from '@lib/data/entities/animaltools/user-pen.entity'
import { Connection, Repository } from 'typeorm'
import { Pen } from '@lib/data/entities/animaltools/pen.entity'
import { Lot } from '@lib/data/entities/animaltools/lot.entity'
import { CustomerFeedlot } from '@lib/data/entities/animaltools/customer-feedlot.entity'
import { UserPermission } from '@lib/data/entities/animaltools/user-permission.entity'
import { Feedlot } from '@lib/data/entities/animaltools/feedlot.entity'

const SIGNUP_KEY = 'signUp'

@Injectable()
export class SharedUserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(Feedlot) private feedlotRepository: Repository<Feedlot>,
    @InjectRepository(UserPen) private userPenRepository: Repository<UserPen>,
    @InjectRepository(UserLot) private userLotRepository: Repository<UserLot>,
    @InjectRepository(Pen) private penRepository: Repository<Pen>,
    @InjectRepository(Lot) private lotRepository: Repository<Lot>,
    @InjectRepository(CustomerFeedlot) private customerFeedlotRepository: Repository<CustomerFeedlot>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(CACHE_MANAGER) private cacheManager,
    private utils: Utils
  ) {}

  /**
   * Save signup key to redis. Example:
   * ```
   * key: "signUp:faa7d8b72932"
   * value: '{"userId":1,"email":"foo@techagr.com"}'
   * ```
   * @param user
   * @param signUpToken
   */
  private async setCacheSignUp(user: User, signUpToken) {
    const keyValue = { key: `${SIGNUP_KEY}:${signUpToken}`, value: `{"userId":${user.id},"email":"${user.email}"}` }
    await this.cacheManager.set(keyValue.key, keyValue.value, { ttl: 86400 * 15 })
  }

  private async getExistingUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ select: ['id', 'email'], where: { email } })
  }

  private async getExistingUserById(userId: number): Promise<User> {
    return this.userRepository.findOne({ select: ['id', 'email'], where: { id: userId } })
  }

  private async getExistingFeedlotById(feedlotId: number): Promise<Feedlot> {
    return this.feedlotRepository.findOne({ select: ['id'], where: { id: feedlotId } })
  }

  private async getExistingFeedlotPen(penId: number, feedlotId: number): Promise<Pen> {
    return this.penRepository.findOne({ select: ['id'], where: { id: penId, feedlotId: feedlotId } })
  }

  private async getExistingFeedlotLot(lotId: number, feedlotId: number): Promise<Lot> {
    return this.lotRepository.findOne({ select: ['id'], where: { id: lotId, feedlotId: feedlotId } })
  }

  private async getCustomerId(feedlotId: number): Promise<number> {
    return (
      await this.customerFeedlotRepository.findOne({
        select: ['customerId'],
        where: { feedlotId: feedlotId, owner: true }
      })
    ).customerId
  }

  /**
   * Verify if user has access to lots and pens asked to be removed
   * @param feedlotId
   * @param userId
   * @param userPermissions
   * @returns userPermissions
   */
  private async getExistingUserAccessesToRemove(
    feedlotId: number,
    userId: number,
    userPermissions: UpdateUserPermissionsSet
  ): Promise<UpdateUserPermissionsSet> {
    const removedUserPens = []
    const removedUserLots = []

    if (userPermissions?.removedLots) {
      await Promise.all(
        userPermissions.removedLots.map(async rl => {
          const removedLot = new UserLot()
          removedLot.feedlotId = feedlotId
          removedLot.lotId = rl
          removedLot.userId = userId

          if ((await this.userLotRepository.findOne(removedLot)) !== undefined) {
            removedUserLots.push(removedLot)
          } else {
            throw new ConflictException(
              'User does not have access to the removed lot or this lot does not belongs to this feedlot'
            )
          }
        })
      )
    }

    if (userPermissions?.removedPens) {
      await Promise.all(
        userPermissions.removedPens.map(async rp => {
          const removedPen = new UserPen()
          removedPen.feedlotId = feedlotId
          removedPen.penId = rp
          removedPen.userId = userId
          if ((await this.userPenRepository.findOne(removedPen)) !== undefined) {
            removedUserPens.push(removedPen)
          } else {
            throw new ConflictException('User does not have access to the removed pen')
          }
        })
      )
    }

    userPermissions.removedLots = removedUserLots
    userPermissions.removedPens = removedUserPens

    return userPermissions
  }

  // async sendUserSignUpEmail(userId: number): Promise<any> {
  //   const user = await this.getExistingUserById(userId)
  //   if (!user) {
  //     throw new ConflictException('User not exists.')
  //   }
  //   if (!user.email) {
  //     throw new ConflictException("User's e-mail not registered.")
  //   }

  //   const token = crypto.randomBytes(6).toString('hex')

  //   await this.setCacheSignUp(user, token)

  //   const urlWebApp = config.get('urlWebApp')
  //   const subject = 'Beeftrader - Complete seu cadastro'

  //   let body = 'Acesse o link abaixo para finalizar seu cadastro:\n\n'
  //   body += `${urlWebApp}/signup?token=${token}\n\n`
  //   body += 'ATENÇÃO: NÃO COMPARTILHE ESSE LINK COM NINGUÉM'

  //   return this.utils.sendEmail(user.email, subject, body)
  // }

  /**
   * Create new user
   * @param user
   * @returns Inserted user
   */
  async addNewUser(user: User): Promise<User> {
    if (await this.getExistingUserByEmail(user.email)) {
      throw new ConflictException('User already exists.')
    }
    // user.password = '$2a$10$gnh2DCQvroR9mJQ6N.FbJOcIw05/oFymCzWf9JL3CI1tzUvzvN6AS' // (await newUser.hashPassword(crypto.randomBytes(6).toString('hex')))
    const newUser = await this.userRepository.save<User>(user)

    // try {
    //   this.sendUserSignUpEmail(newUser.id)
    // } catch (error) {
    //   console.log(error.message)
    // }

    return newUser
  }

  /**
   * Update user
   * @param user
   * @returns Updated user
   */
  async updateUser(user: User): Promise<User> {
    const existingUser = await this.getExistingUserById(user.id)

    if (!existingUser) {
      throw new ConflictException('User not exists.')
    }

    if (existingUser.email !== user.email) {
      if (await this.getExistingUserByEmail(user.email)) {
        throw new ConflictException('User already exists.')
      }
    }

    return this.userRepository.save<User>(user)
  }

  // async addExistingUserToFeedlot(feedlotId: number, userId: number, userPermissions: UserPermissionsSet) {
  //   if (!(await this.getExistingUserById(userId))) {
  //     throw new ConflictException('User not exists.')
  //   }

  //   await this.userRepository.addExistingUserToFeedlot(feedlotId, userId, userPermissions)
  // }

  /**
   * Deleted user and its permissions
   * @param userId
   * @returns Deleted user
   */
  async deleteUser(userId: number): Promise<User> {
    if (!(await this.getExistingUserById(userId))) {
      throw new ConflictException('User not exists.')
    }
    try {
      return this.userRepository.deleteUser(userId)
    } catch (err) {
      throw new InternalServerErrorException()
    }
  }

  /**
   * Add new user permissions
   * @param feedlotId
   * @param userId
   * @param userPermissions
   * @returns Inserted user permissions
   */
  async createUserPermissions(
    feedlotId: number,
    userId: number[],
    userPermissions: UserPermissionsSet
  ): Promise<UserPermission[]> {
    await Promise.all(
      userId.map(async id => {
        const existingUser = await this.getExistingUserById(id)
        if (!existingUser) {
          throw new ConflictException('User not exists.')
        }
      })
    )

    const existingFeedlot = await this.getExistingFeedlotById(feedlotId)
    if (!existingFeedlot) {
      throw new ConflictException('Feedlot not exists.')
    }

    if (userPermissions.pens) {
      await Promise.all(
        userPermissions?.pens.map(async p => {
          if (!(await this.getExistingFeedlotPen(p, feedlotId))) {
            throw new ConflictException('This pen does not belong to feedlot')
          }
        })
      )
    }
    if (userPermissions.lots) {
      await Promise.all(
        userPermissions?.lots.map(async l => {
          if (!(await this.getExistingFeedlotLot(l, feedlotId))) {
            throw new ConflictException('This lot does not belong to feedlot')
          }
        })
      )
    }
    let newUserPermissions = await this.connection.transaction(async entityManager => {
      return this.userRepository.savePermissions(entityManager, userPermissions, { feedlotId, userId })
    })
    return newUserPermissions
  }

  /**
   * Add new user permissions
   * @param feedlotId
   * @param userId
   * @param userPermissions
   * @returns Inserted user permissions
   */
  async updateUserPermissions(
    feedlotId: number,
    userId: number,
    permissions: UpdateUserPermissionsSet
  ): Promise<UserPermission[]> {
    const userPermissions = await this.getExistingUserAccessesToRemove(feedlotId, userId, permissions)
    const existingUser = await this.getExistingUserById(userId)
    if (!existingUser) {
      throw new ConflictException('User not exists.')
    }

    const existingFeedlot = await this.getExistingFeedlotById(feedlotId)
    if (!existingFeedlot) {
      throw new ConflictException('Feedlot not exists.')
    }

    if (userPermissions.pens) {
      await Promise.all(
        userPermissions?.pens.map(async p => {
          if (!(await this.getExistingFeedlotPen(p, feedlotId))) {
            throw new ConflictException('This pen does not belong to feedlot')
          }
        })
      )
    }
    if (userPermissions.lots) {
      await Promise.all(
        userPermissions?.lots.map(async l => {
          if (!(await this.getExistingFeedlotLot(l, feedlotId))) {
            throw new ConflictException('This lot does not belong to feedlot')
          }
        })
      )
    }
    return this.userRepository.updateUserPermissions(feedlotId, userId, permissions)
  }
}
