import { Body, Controller, Get, HttpStatus, Inject, InternalServerErrorException, Param, ParseIntPipe, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { User } from './entities/user.entity';
import { RepositoryException } from '../global/exception/exception.repository';
import { AuthGuard } from '../global/guards/auth.guard';
import { Role } from '../global/enum/role.enum';
import { Roles } from '../global/decorators/role.decorator';
import { TransformRes } from '../global/interceptors/transform-body-res.interceptor';
import { UserBodyDto } from './dto/res/user-body.dto';
import { UserServiceItf } from './user.service.interface';

@Controller('user')
@TransformRes(UserBodyDto)
export class UserController {
    constructor(@Inject('UserServiceItf') private readonly userService: UserServiceItf) {}

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get()
    adminGetAllUsers(@Query('name') name?: string): Promise<User[]> {
        try{
            const allUsers = this.userService.getAllUsers(name);
            return allUsers;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfileUser(@Request() request): Promise<User> {
        try{
            const userProfile = await this.userService.getProfileUser(request.user.id);
            return userProfile;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException()           
        }
    }
    
    @UseGuards(AuthGuard)
    @Patch('profile')
    async updatedUserProfile(@Request() request, @Body() body: UpdateUserDto & { oldPassword?: string }) {
        try{
            const updateProfile = this.userService.updateUserProfile({
                id: request.user.id,
                body,
                oldPassword: body.oldPassword,
            })
            return updateProfile;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get('/:id')
    async adminGetUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        try {
            const user = await this.userService.adminGetUser(id);
            return user;
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
