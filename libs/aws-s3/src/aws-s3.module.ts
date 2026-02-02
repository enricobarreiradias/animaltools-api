import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { ConfigModule } from '@nestjs/config'; // <-- Módulo necessário para ler as variáveis de ambiente

@Module({
  // Importamos o ConfigModule para que o ConfigService possa ser injetado no AwsS3Service
  imports: [ConfigModule], 
  providers: [AwsS3Service],
  exports: [AwsS3Service], // Exporta o serviço para ser usado em outros módulos
})
export class AwsS3Module {}