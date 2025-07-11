import { CreateUserDto } from "src/user/dto/req/create-user.dto";
import { User } from "src/user/entities/user.entity";
import { LoginUserDto } from "./dto/login-user.dto";


export interface AuthServiceItf {
    register(bodyData: Register): Promise<User>;
    login(bodyData: Login): Promise<{ access_token: string }>;
}

export interface Register {
    body: CreateUserDto
}

export interface Login {
    body: LoginUserDto
}