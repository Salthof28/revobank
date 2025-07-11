import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { AuthServiceItf, Login, Register } from './auth.service.interface';
import { User } from 'src/user/entities/user.entity';
import { mockUsers } from 'src/user/data/mock-user';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from "crypto"; // change name function callback to _scrypt
import { promisify } from "util";
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService implements AuthServiceItf {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  register(bodyData: Register): Promise<User> {
    return this.userRepository.created(bodyData);
  }

  async login(bodyData: Login): Promise<{ access_token: string }> {
    // get first data found and destructing array become object
    const user: User | undefined = mockUsers.find(user => user.email === bodyData.body.email);
    if(!user) throw new UserNotFoundException();
    
    // check password from user does it fit with salt and hash from database
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(bodyData.body.password, salt, 64)) as Buffer;

    if(storedHash !== hash.toString('hex')) throw new BadRequestException('email or passwrod in valid');
    // return user;
    const payload = { id: user.id, email: user.email, name: user.name, phone: user.phone, number_ktp: user.number_ktp, role: user.role }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
