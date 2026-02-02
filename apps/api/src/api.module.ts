import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { animaltoolsTypeOrmConfig } from '@lib/config/typeorm';
import { DentalEvaluationModule } from './dental-evaluation/dental-evaluation.module';
// 1. Importar o ConfigModule
import { ConfigModule } from '@nestjs/config';
// 2. Importar o arquivo de configuração de ambiente
import * as developmentConfig from '@lib/config/development-aws';
//Importação da autenticação
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
     // 3. Carregar o ConfigModule e as configurações
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigService acessível em qualquer lugarca
      load: [() => developmentConfig], // Carrega o objeto de configuração importado
    }),
    UserModule,
    TypeOrmModule.forRoot(animaltoolsTypeOrmConfig),
    DentalEvaluationModule,
  ],
  providers: [],
})
export class ApiModule {}
