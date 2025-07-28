import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// jwtConstants.secret
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }
      })
    })
  ],
  controllers: [UserController],
  providers: [
    { provide: 'UserServiceItf' , useClass: UserService },
    { provide: 'UserRepositoryItf', useClass: UserRepository }
  ],
  exports: ['UserRepositoryItf']
})
export class UserModule {}
