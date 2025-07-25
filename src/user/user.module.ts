import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' }
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
