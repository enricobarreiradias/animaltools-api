import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import pgConfig from './pg';

// --- Importações das Entidades ---
import { User } from '@lib/data/entities/user.entity';
import { Animal } from '@lib/data/entities/animal.entity';
import { DentalEvaluation } from '@lib/data/entities/dental-evaluation.entity';
import { Media } from '@lib/data/entities/media.entity';
import { ToothEvaluation } from '@lib/data/entities/tooth-evaluation.entity';
import { AuditLog } from '@lib/data/entities/audit-log.entity';

// LISTA DE ENTIDADES COMPLETA
const animaltoolsEntities = [
  User,
  Animal,
  DentalEvaluation,
  Media,
  ToothEvaluation, 
  AuditLog, 
];

const animaltoolsDbConfig = pgConfig('animaltools');

export const animaltoolsTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOSTNAME || animaltoolsDbConfig.host,
  port: Number(process.env.DB_PORT) || animaltoolsDbConfig.port,
  username: process.env.DB_USERNAME || animaltoolsDbConfig.user,
  password: process.env.DB_PASSWORD || animaltoolsDbConfig.password,
  database: process.env.DB_NAME || animaltoolsDbConfig.database,

  entities: [...animaltoolsEntities],
  synchronize: false,
  logging: process.env.ENABLE_DEV_ENV === '1' ? ['query', 'error'] : false,
};
