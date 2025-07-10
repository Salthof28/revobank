import { CreateUserDto } from "src/user/dto/req/create-user.dto";
import { User } from "src/user/entities/user.entity";


export interface AuthServiceItf {
    register(bodyData: Register): User;
    login(bodyData: Login): User;
}

export interface Register {
    body: CreateUserDto
}

export interface Login {
    body: CreateUserDto
}