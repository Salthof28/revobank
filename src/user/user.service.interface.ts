import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { UpdateUserDto } from "./dto/req/update-user.dto";
import { User } from "./entities/user.entity";


export interface UserServiceItf {
    getAllUsers(query: GetAllUsers): User[];
    getUser(param: GetUser): User;
    updateUser(paramBody: UpdateUser): User;
    getProfileUser(request: number): User;
}

export interface GetAllUsers {
    name: string
}

export interface GetUser {
    id: number
}

export interface UpdateUser {
    id: number,
    body: UpdateUserDto
}