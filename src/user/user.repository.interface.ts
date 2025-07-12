import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/req/update-user.dto";
import { CreateUserDto } from "./dto/req/create-user.dto";
import { LoginUserDto } from "src/auth/dto/login-user.dto";


export interface UserRepositoryItf {
    getAll(query: GetAll): User[];
    getOne(param: GetOne): User;
    updated(paramBody: Updated): User;
    created(bodyData: Create): Promise<User>;
    getProfile(request: number): User;
}

export interface GetAll {
    name: string
}

export interface GetOne {
    id: number
}

export interface Updated {
    id: number,
    body: UpdateUserDto
}

export interface Create {
    body: CreateUserDto
}

