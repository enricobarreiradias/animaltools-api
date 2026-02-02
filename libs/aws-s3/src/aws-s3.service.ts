import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

@Injectable()
export class AwsS3Service {
  private s3: S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    // 1. Obter o nome e a região do bucket da sua configuração
    const s3Config = this.configService.get('aws.s3.buckets.animaltoolsImages');

    if (!s3Config || !s3Config.name || !s3Config.region) {
      throw new InternalServerErrorException('Configurações AWS S3 ausentes.');
    }

    // 2. Obter as credenciais AWS globais
    const awsGlobalConfig = this.configService.get('aws');
    
    this.bucketName = s3Config.name;

    this.s3 = new S3({
      accessKeyId: awsGlobalConfig.accessKeyId,
      secretAccessKey: awsGlobalConfig.secretAccessKey,
      region: s3Config.region, 
    });
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
      ACL: 'public-read', // Permite acesso público ao arquivo (opcional, dependendo do uso)
    };

    try {
      // Faz o upload e espera pela promessa
      const result = await this.s3.upload(uploadParams).promise();
      
      // Retorna a chave que foi usada no upload
      return result.Key; 
      
    } catch (error) {
      console.error('Falha no S3 Upload:', error.message);
      // Lança um erro interno para ser capturado no Controller
      throw new InternalServerErrorException('Falha no upload para o S3. Verifique credenciais e permissões.');
    }
  }
}