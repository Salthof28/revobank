import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './global/middlewares/logger.middleware';
import { RateLimitMiddleware } from './global/middlewares/rate-limit.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AccountsModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
