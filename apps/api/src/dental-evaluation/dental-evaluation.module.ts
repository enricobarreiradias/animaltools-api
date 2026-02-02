import { Module } from '@nestjs/common';
import { DentalEvaluationService } from './dental-evaluation.service';
import { DentalEvaluationController } from './dental-evaluation.controller';
// CORREÇÃO 1: Usando o alias @lib/data
import { RepositoryModule } from '@lib/data/repos/repository.module';
// CORREÇÃO 2: Usando o alias @lib/aws-s3
import { AwsS3Module } from '@lib/aws-s3/aws-s3.module';

@Module({
  imports: [
    RepositoryModule, //Permite acesso às 4 entidades 
    AwsS3Module,      //Permite injetar o AwsS3Service
  ],
  controllers: [DentalEvaluationController],
  providers: [DentalEvaluationService],
  exports: [DentalEvaluationService],
})
export class DentalEvaluationModule {}