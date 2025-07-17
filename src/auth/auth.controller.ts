import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RepositoryException } from 'src/global/exception/exception.repository';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() body: CreateUserDto) {
    // try{
      const newUser = await this.authService.register(body)
      return newUser;
    // } catch (error) {
    //     if(error instanceof RepositoryException) throw error;
    //     throw new InternalServerErrorException({
    //       message: 'something wrong on our side',
    //       error: 'internal server error',
    //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //     })
    // }

  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return await this.authService.login(body)
  }

}
