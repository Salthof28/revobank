import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { PrismaModule } from '../../prisma/prisma.module';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsRepository } from './transactions.repository';
import { AccountsRepository } from 'src/accounts/accounts.repository';

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
  providers: [
    { provide: 'TransactionsServiceItf', useClass: TransactionsService }, 
    { provide: 'TransactionsRepositoryItf', useClass: TransactionsRepository },
  ],
})
export class TransactionsModule {}
