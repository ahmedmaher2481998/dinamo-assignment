import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



const config = new DocumentBuilder()
  .setTitle('(Dinamo) technical assignment')
  .setDescription('Recourse this api mages i [User , Vendor , Product , Product,Cart]')
  .setVersion('0.1')
  .addBearerAuth()
  .build();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global config 
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Serve at /api-docs

  // listing for requests 
  await app.listen(3000, () => console.log(`Starting app at port:3000`));
}
bootstrap();
