import { CreateUserDto } from "src/user/dto/req/create-user.dto";
import { User } from "src/user/entities/user.entity";
import { LoginUserDto } from "./dto/login-user.dto";


export interface AuthServiceItf {
    register(body: CreateUserDto): Promise<User>;
    login(body: LoginUserDto): Promise<{ access_token: string }>;
}
