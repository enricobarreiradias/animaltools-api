import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config'; // Usando a lib de config

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(ApiModule);

  app.setGlobalPrefix('api');

  // Habilitar CORS (Importante para o frontend acessar)
  app.enableCors();

  // Validação Global (Para os DTOs funcionarem)
  // whitelist: true strips unknown properties; forbidNonWhitelisted: false avoids 400 when frontends send extra fields (e.g. from API response)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Configuração do Swagger (Documentação)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AnimalTools API')
    .setDescription('API Unificada (Admin + App)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Definir Porta
  // Tenta ler do config, se não der, tenta variável de ambiente, ou usa 3333
  const serverConfig = (config.has('server')
    ? config.get('server')
    : { port: 3333 }) as { port?: number };
  const port = process.env.PORT || serverConfig.port || 3333;

  await app.listen(port);
  logger.log(`API Unificada rodando em http://localhost:${port}`);
  logger.log(`Swagger disponível em http://localhost:${port}/api`);
}
void bootstrap();