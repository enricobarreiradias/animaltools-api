// --------
// ENTITIES
// --------

import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import pgConfig from './pg'

// animaltools - Importações corrigidas e adicionadas
import { User } from '@lib/data/entities/animaltools/user.entity'
import { Animal } from '@lib/data/entities/animaltools/animal.entity' // Adicionado
import { DentalEvaluation } from '@lib/data/entities/animaltools/dental-evaluation.entity' // Adicionado
import { Media } from '@lib/data/entities/animaltools/media.entity' // Adicionado (Assumindo que essa é a entidade)


// LISTA DE ENTIDADES COMPLETA
const animaltoolsEntities = [
  User,
  Animal,
  DentalEvaluation,
  Media,
]

const animaltoolsDbConfig = pgConfig('animaltools')

export const animaltoolsTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // Credenciais de conexão (host, port, user, password, database)
  host: process.env.DB_HOSTNAME || animaltoolsDbConfig.host,
  port: Number(process.env.DB_PORT) || animaltoolsDbConfig.port,
  username: process.env.DB_USERNAME || animaltoolsDbConfig.user,
  password: process.env.DB_PASSWORD || animaltoolsDbConfig.password,
  database: process.env.DB_NAME || animaltoolsDbConfig.database,
  
  // Carregamento de todas as entidades
  entities: [...animaltoolsEntities],
  synchronize: false, // É bom manter 'false' em produção/dev se estiver usando Migrations
  logging: process.env.ENABLE_DEV_ENV === '1' ? ['query', 'error'] : false
}