import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/req/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUsers(@Query('name') name: string) {
        return this.userService.getAllUsers({name})
    }

    @Get('/:id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUser({id});
    }

    @Patch('/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
        return this.userService.updateUser({id, body})
    }

}
