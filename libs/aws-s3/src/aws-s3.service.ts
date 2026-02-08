import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import * as config from 'config'; // <--- Usando a lib 'config' diretamente

// Interface auxiliar para tipar a config do S3
interface S3BucketConfig {
  name: string;
  region: string;
}

@Injectable()
export class AwsS3Service {
  private s3: S3;
  private readonly bucketName: string;
  private readonly logger = new Logger(AwsS3Service.name);

  constructor() {
    // 1. Definir o caminho da configuração no default.js
    const s3ConfigPath = 'aws.s3.buckets.animaltoolsImages';

    // 2. Verificar se a configuração existe antes de ler
    if (!config.has(s3ConfigPath)) {
      throw new InternalServerErrorException(`Configuração '${s3ConfigPath}' não encontrada no default.js.`);
    }

    // 3. Ler a configuração
    const s3Config = config.get<S3BucketConfig>(s3ConfigPath);

    if (!s3Config.name || !s3Config.region) {
      throw new InternalServerErrorException('Configurações AWS S3 (name/region) estão incompletas.');
    }

    // 4. Ler as credenciais globais da AWS
    const awsGlobalConfig = config.get<any>('aws'); // Usando any aqui pois a estrutura pode variar, mas funciona.
    
    this.bucketName = s3Config.name;

    // 5. Inicializar o S3 com as credenciais lidas
    this.s3 = new S3({
      accessKeyId: awsGlobalConfig.accessKeyId,
      secretAccessKey: awsGlobalConfig.secretAccessKey,
      region: s3Config.region, 
    });

    this.logger.log(`✅ AWS S3 Service inicializado. Bucket: ${this.bucketName}`);
  }

  /**
   * Faz o upload de um buffer de arquivo para o S3.
   * @param buffer O buffer do arquivo.
   * @param key O nome final do arquivo (incluindo o caminho da pasta).
   * @param mimetype O tipo MIME do arquivo (ex: image/jpeg).
   * @returns A chave do arquivo no S3.
   */
  async uploadFile(buffer: Buffer, key: string, mimetype: string): Promise<string> {
    const uploadParams: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key, 
      Body: buffer, 
      ContentType: mimetype,
      ACL: 'public-read', // Permite acesso público ao arquivo
    };

    try {
      // Faz o upload e espera pela promessa
      const result = await this.s3.upload(uploadParams).promise();
      
      this.logger.verbose(`Upload concluído: ${result.Key}`);
      // Retorna a chave que foi usada no upload
      return result.Key; 
      
    } catch (error) {
      this.logger.error(`Falha no S3 Upload para ${key}:`, error);
      // Lança um erro interno para ser capturado no Controller
      throw new InternalServerErrorException('Falha no upload para o S3. Verifique credenciais e permissões.');
    }
  }
}