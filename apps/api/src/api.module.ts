import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core'; 
import { AuditInterceptor } from './audit/audit.interceptor'; 

import { DentalEvaluationModule } from './dental-evaluation/dental-evaluation.module';
import { UserModule } from './user/user.module';

import { AnimalModule } from './animal/animal.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';

import { animaltoolsTypeOrmConfig } from '@lib/config/typeorm';

@Module({
  imports: [
    // 1. Configuração Global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Banco de Dados (Usando a config centralizada da lib)
    TypeOrmModule.forRootAsync({
      useFactory: () => animaltoolsTypeOrmConfig,
    }),

    // 3. Arquivos Estáticos (Uploads)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 4. Módulos de Funcionalidade
    AuthModule,
    UserModule,
    AnimalModule,
    EvaluationModule,
    DentalEvaluationModule,
    AuditModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class ApiModule {}