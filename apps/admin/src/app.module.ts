import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

// Importações dos seus módulos de funcionalidade
import { EvaluationModule } from './evaluation/evaluation.module';
import { AnimalModule } from './animal/animal.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';

// A MÁGICA: Importar a configuração compartilhada que o outro estagiário criou
// Certifique-se que o path alias '@lib/config' está funcionando no tsconfig do admin
import { animaltoolsTypeOrmConfig } from '@lib/config/typeorm';

@Module({
  imports: [
    // 1. ConfigModule Global
    // Mantemos isso para carregar o .env para coisas específicas do admin se precisar,
    // mas o banco de dados vai usar a config da lib.
    ConfigModule.forRoot({
      isGlobal: true,
      // Se necessário, carregue também os arquivos de configuração que a API usa
      // load: [configuration],
    }),

    // 2. Arquivos Estáticos (Uploads)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'uploads'), // Cuidado: Em produção (dist), isso pode mudar.
      serveRoot: '/uploads',
    }),

    // 3. TypeORM Unificado
    // Em vez de configurar tudo aqui, usamos a config exportada da lib.
    // Isso resolve o problema de não encontrar as entidades User, Animal, etc.
    TypeOrmModule.forRootAsync({
      useFactory: () => animaltoolsTypeOrmConfig,
    }),

    // 4. Seus Módulos
    EvaluationModule,
    AnimalModule,
    AuthModule,
    AuditModule,
  ],
})
export class AppModule {}
