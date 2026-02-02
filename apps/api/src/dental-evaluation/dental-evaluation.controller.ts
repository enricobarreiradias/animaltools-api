import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body,
  InternalServerErrorException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// CORREÇÃO: Usando o ALIAS configurado no tsconfig.json para resolver o erro de caminho relativo
import { AwsS3Service } from '@lib/aws-s3/aws-s3.service';
import { DentalEvaluationService } from './dental-evaluation.service';

@Controller('dental-evaluation')
export class DentalEvaluationController {
  constructor(
    private readonly evaluationService: DentalEvaluationService,
    private readonly s3Service: AwsS3Service, 
  ) {}

  @Post('upload-media')

  @UseInterceptors(FileInterceptor('file')) 
  async uploadMedia(
    // CORREÇÃO: Mudar a tipagem do arquivo para 'any' para evitar o erro 2694
    @UploadedFile() file: any,
    @Body('animalId') animalId: string, 
  ) {
    if (!file) {
      throw new InternalServerErrorException('Nenhum arquivo enviado.');
    }

    try {
      //Gerar um nome de arquivo único e descritivo 
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `animal/${animalId}/${Date.now()}.${fileExtension}`; 
      
      //Chamar o serviço S3 para fazer o upload
      const s3Key = await this.s3Service.uploadFile(
        file.buffer, // Buffer do arquivo
        uniqueFileName, // Nome final no S3
        file.mimetype, // Tipo MIME (image/jpeg)
      );
      
      //Registrar o s3Key na tabela 'media' (Lógica a ser implementada no Service)

      return { 
        message: 'Upload de mídia concluído com sucesso.', 
        s3Key: s3Key 
      };

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Falha no upload de imagem.');
    }
  }
}