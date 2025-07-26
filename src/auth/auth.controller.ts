import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, InternalServerErrorException, Inject } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/req/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RepositoryException } from '../global/exception/exception.repository';
import { User } from '../user/entities/user.entity';
import { TransformRes } from '../global/interceptors/transform-body-res.interceptor';
import { UserBodyDto } from '../user/dto/res/user-body.dto';
import { AuthServiceItf } from './auth.service.interface';


@Controller('auth')
export class AuthController {
  constructor(@Inject('AuthServiceItf') private readonly authService: AuthServiceItf) {}
  
  @Post('register')
  @TransformRes(UserBodyDto)
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
    // try{
      const loginUser = await this.authService.login(body)
      return loginUser;
    // } catch (error) {
    //   if(error instanceof RepositoryException) throw error;
      // throw new InternalServerErrorException({
      //   message: 'something wrong on our side',
      //   error: 'internal server error',
      //   statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      // })
    // }
  }

}
