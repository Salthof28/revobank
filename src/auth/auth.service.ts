import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { AuthServiceItf } from './auth.service.interface';
import { User } from 'src/user/entities/user.entity';
// import { mockUsers } from 'src/user/data/mock-user';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from "crypto"; // change name function callback to _scrypt
import { promisify } from "util";
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailRegisteredException } from './exceptions/email-registered-exception';
import { PhoneRegisteredException } from './exceptions/phone-registered-exception';
import { KtpRegisteredException } from './exceptions/ktp-registered-exception';
import { InvalidLoginException } from './exceptions/invalid-login-exception';
import { Condition } from 'src/global/entities/condition.entity';
import { UserRepositoryItf } from 'src/user/user.repository.interface';

const scrypt = promisify(_scrypt);
@Injectable()

export class AuthService implements AuthServiceItf  {
  constructor(@Inject('UserRepositoryItf') private userRepository: UserRepositoryItf, private jwtService: JwtService) {}

  async register(body: CreateUserDto): Promise<User> {
    // chceking email, phone, and ktp registered
    // use findFirst because can run one query for any condition
    const condition: Condition[] = [
      {email: body.email},
      {phone: body.phone},
      {number_ktp: body.number_ktp}
    ];
    const existing: User | undefined = await this.userRepository.findExistingUser(condition);
    if(existing) {
      if (existing.email === body.email?.toLowerCase()) throw new EmailRegisteredException();
      if (existing.phone === body.phone) throw new PhoneRegisteredException();
      if (existing.number_ktp === body.number_ktp) throw new KtpRegisteredException();
    }

    // hash password process
    const salt = randomBytes(8).toString('hex');
    // use buffer because we use typescript and hash return buffer
    const hash = (await scrypt(body.password, salt, 64)) as Buffer;
    // seperate salt and hash with dot (default format);
    body.password = salt + '.' + hash.toString('hex');
    return this.userRepository.created(body);
  }

  async login(body: LoginUserDto): Promise<{ access_token: string }> {
    // get first data found and destructing array become object
    const user: User | undefined = await this.userRepository.findEmail(body.email);
    if(!user) throw new InvalidLoginException();
    
    // check password from user does it fit with salt and hash from database
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(body.password, salt, 64)) as Buffer;

    if(storedHash !== hash.toString('hex')) throw new InvalidLoginException();
    // return user;
    const payload = { id: user.id, email: user.email, name: user.name, phone: user.phone, number_ktp: user.number_ktp, role_user: user.role_user }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
