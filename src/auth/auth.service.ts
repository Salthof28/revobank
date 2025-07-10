import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from 'src/user/user.repository';
import { GetAll } from 'src/user/user.repository.interface';
import { AuthServiceItf, Login, Register } from './auth.service.interface';
import { User } from 'src/user/entities/user.entity';
import { mockUsers } from 'src/user/data/mock-user';

@Injectable()
export class AuthService implements AuthServiceItf {
  constructor(private userRepository: UserRepository) {}
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }
  register(bodyData: Register): User {
    return this.userRepository.created(bodyData);
  }

  login(bodyData: Login): User {
    return mockUsers[0];
  }
}
