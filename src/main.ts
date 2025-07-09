import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionFilterRepository } from './global/filters/repository-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionFilterRepository(httpAdapterHost));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
