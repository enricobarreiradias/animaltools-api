// apps/api/src/user/user.service.ts

// 1. CORREÇÃO: Apontando para a entidade correta (a mesma do Auth e do TypeORM config)
import { User } from '@lib/data/entities/user.entity'; 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async getAllUsers(): Promise<User[]> {
        try {
            const user = await this.userRepository.find()
            return user
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getUserById(id: number) {
        try {
            // Nota: findBy requer um objeto where
            const user = await this.userRepository.findBy({ id: id })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async createUser(user: Partial<User>): Promise<User> {
        try {
            const newUser = await this.userRepository.save(user)
            return newUser
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async updateUser(id: number, user: Partial<User>) {
        try {
            await this.userRepository
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
            throw error
        }
    }

    async deleteUser(id: number) {
        try {
            await this.userRepository
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
            throw error
        }
    }
}