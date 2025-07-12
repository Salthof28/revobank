import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { User } from './entities/user.entity';
import { RepositoryException } from 'src/global/exception/exception.repository';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { Role } from 'src/global/enum/role.enum';
import { Roles } from 'src/global/decorators/role.decorator';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get()
    getAllUsers(@Query('name') name: string): User[] {
        try{
            const allUsers = this.userService.getAllUsers({name})
            return allUsers;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfileUser(@Request() request): User {
        return this.userService.getProfileUser(request.user.id)
    }
    
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Get('/:id')
    getUser(@Param('id', ParseIntPipe) id: number): User {
        try {
            const user = this.userService.getUser({id});
            return user;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto): User {
        try{
            const updateUser = this.userService.updateUser({id, body});
            return updateUser;
        } catch (error) {
            if(error instanceof RepositoryException) throw error;
            throw new InternalServerErrorException();
        }
    }

}
