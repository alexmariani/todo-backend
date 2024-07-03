import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: Object.keys(error.constraints).map(
            (key) => error.constraints[key],
          ),
        }));
        return new BadRequestException(formattedErrors);
      },
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  // Creazione swagger per l'interfaccia api con il FE

  const config = new DocumentBuilder()
    .setTitle('Todo example')
    .setDescription('The Todo API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Espone l'endpoint per il ritorno del json
  app.use('/api-json', (_, res) => {
    res.json(document);
  });

  //Fine swagger

  await app.listen(8080);
}
bootstrap();
