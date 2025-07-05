import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AccountsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
