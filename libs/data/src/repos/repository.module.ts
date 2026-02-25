import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

//Ajusta o caminho
import { User } from '../entities/user.entity'; 
import { Animal } from '../entities/animal.entity'; 
import { DentalEvaluation } from '../entities/dental-evaluation.entity'; 
import { Media } from '../entities/media.entity'; 

const entities = [
    User,
    Animal,
    DentalEvaluation,
    Media,
];

//Registra o TypeOrmModule.forFeature com todas as entidades
const repos = [
    TypeOrmModule.forFeature(entities)
]

@Module({
 imports: [...repos],
  //Exporta os epositórios para que outros módulos possam usá-los
  exports: [...repos]
})
export class RepositoryModule {}