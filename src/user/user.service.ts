import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { GetAllUsers, GetUser, UpdateUser, UserServiceItf } from './user.service.interface';
import { User } from './entities/user.entity';


@Injectable()
export class UserService implements UserServiceItf {
    constructor(private userRepository: UserRepository) {}

    getAllUsers(query: GetAllUsers): User[] {
        return this.userRepository.getAll(query);
    }

    getUser(param: GetUser): User {
        return this.userRepository.getOne(param);
    }

    updateUser(paramBody: UpdateUser): User {
        return this.userRepository.updated(paramBody);
    }


}
