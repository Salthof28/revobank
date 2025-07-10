import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [UserRepository],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
