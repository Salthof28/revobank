import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsRepository } from './transactions.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AccountsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }
      })
    })
  ],
  controllers: [TransactionsController],
  providers: [
    { provide: 'TransactionsServiceItf', useClass: TransactionsService }, 
    { provide: 'TransactionsRepositoryItf', useClass: TransactionsRepository },
  ],
})
export class TransactionsModule {}
