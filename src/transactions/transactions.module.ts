import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { PrismaModule } from 'prisma/prisma.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsRepository } from './transactions.repository';

@Module({
  imports: [
    PrismaModule,
    AccountsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' }
    })
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
