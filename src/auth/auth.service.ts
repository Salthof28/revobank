import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { AuthServiceItf } from './auth.service.interface';
import { User } from 'src/user/entities/user.entity';
// import { mockUsers } from 'src/user/data/mock-user';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from "crypto"; // change name function callback to _scrypt
import { promisify } from "util";
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

const scrypt = promisify(_scrypt);
@Injectable()
// implements AuthServiceItf
export class AuthService  {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  async register(body: CreateUserDto): Promise<User> {
    // chceking email, phone, and ktp registered
    const findUserEmail: User | undefined = await this.userRepository.findEmail(body.email);
    if(findUserEmail) throw new ConflictException('Email Registered');
    const findUserPhone: User | undefined = await this.userRepository.findPhone(body.phone);
    if(findUserPhone) throw new ConflictException('Number Phone Registered');
    const findUserKtp: User | undefined = await this.userRepository.findKtp(body.number_ktp);
    if(findUserKtp) throw new ConflictException('Number KTP Registered');
    
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
    if(!user) throw new BadRequestException('email or passwrod in valid');
    
    // check password from user does it fit with salt and hash from database
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(body.password, salt, 64)) as Buffer;

    if(storedHash !== hash.toString('hex')) throw new BadRequestException('email or passwrod in valid');
    // return user;
    const payload = { id: user.id, email: user.email, name: user.name, phone: user.phone, number_ktp: user.number_ktp, role_user: user.role_user }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
