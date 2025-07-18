import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RepositoryException } from 'src/global/exception/exception.repository';
import { User } from 'src/user/entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() body: CreateUserDto): Promise<User> {
    try{
      const newUser = await this.authService.register(body)
      return newUser;
    } catch (error) {
        if(error instanceof RepositoryException) throw error;
        throw new InternalServerErrorException({
          message: 'something wrong on our side',
          error: 'internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        })
    }

  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<{ access_token: string }> {
    try{
      const loginUser = await this.authService.login(body)
      return loginUser;
    } catch (error) {
      if(error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }

}
