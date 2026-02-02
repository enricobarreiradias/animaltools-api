import { User } from '@lib/data/entities/animaltools/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async getAllUsers() {
        try {
            const user = this.userRepository.find()
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async getUserById(id) {
        try {
            const user = this.userRepository.findBy({ id: id })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async createUser(user) {
        try {
            const newUser = await this.userRepository.save(user)
            return newUser
        } catch (error) {
            console.log(error)
        }
    }

    async updateUser(id, user) {
        try {
            this.userRepository
                .createQueryBuilder()
                .update(User)
                .set(user)
                .where('id = :id', { id: id })
                .execute()
            return {
                message: `Usuário ${id} alterado com sucesso`
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteUser(id) {
        try {
            this.userRepository
                .createQueryBuilder()
                .delete()
                .from(User)
                .where('id = :id', { id: id })
                .execute()
            return {
                message: 'Usuário removido'
            }
        } catch (error) {
            console.log(error)
        }
    }
}
