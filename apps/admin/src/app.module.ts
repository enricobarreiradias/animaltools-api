import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { EvaluationModule } from './evaluation/evaluation.module';
import { AnimalModule } from './animal/animal.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';

import { animaltoolsTypeOrmConfig } from '@lib/config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'uploads'), 
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => animaltoolsTypeOrmConfig,
    }),

    EvaluationModule,
    AnimalModule,
    AuthModule,
    AuditModule,
  ],
})
export class AppModule {}
