import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  @Post('register')
  registerUser(@Body() body: CreateUserDto) {
    return this.authService.register({body})
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return await this.authService.login({body})
  }

}
