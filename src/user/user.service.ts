import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUser, UserServiceItf } from './user.service.interface';
import { User } from './entities/user.entity';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';


@Injectable()
 
export class UserService implements UserServiceItf  {
    constructor(private userRepository: UserRepository) {}

    // getAllUsers(query: GetAllUsers): User[] {
    //     return this.userRepository.getAll(query);
    // }

    // getUser(param: GetUser): User {
    //     return this.userRepository.getOne(param);
    // }

    // updateUser(paramBody: UpdateUser): User {
    //     return this.userRepository.updated(paramBody);
    // }

    async getProfileUser(request: number): Promise<User> {
        const userProfile = await this.userRepository.getOne(request);
        if(!userProfile) throw new UserNotFoundException()
        return userProfile;
    }
}
