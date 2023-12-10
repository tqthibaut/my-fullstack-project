import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  console.log('STARTING SERVER');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'], // Include 'debug' to enable debug logs
  });
  app.enableCors({
    origin: 'http://localhost:3001', // Your frontend URL here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
    // Access-Control-Allow-Origin: 'http://localhost:3001',
  }); // Enable CORS for all routes and origins
  const usersService = app.get(UsersService);
  await usersService.seedTestUser();
  await app.listen(3000);
}
bootstrap();
