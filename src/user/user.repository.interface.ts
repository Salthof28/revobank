import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/req/update-user.dto";
import { CreateUserDto } from "./dto/req/create-user.dto";
import { LoginUserDto } from "src/auth/dto/login-user.dto";


export interface UserRepositoryItf {
    // getAll(name: string): User[];
    getOne(id: number): Promise<User | undefined>;
    updated(paramBody: Updated): Promise<User>;
    // updatedProfile(body: UpdateUserDto): Promise<User>;
    created(body: CreateUserDto): Promise<User>;
    // getProfile(request: number): Promise<User>;
    findEmail(email: string): Promise<User | undefined>;
    findPhone(phone: string): Promise<User | undefined>;
    findKtp(number_ktp: string): Promise<User | undefined>;
}


export interface Updated {
    id?: number,
    body: UpdateUserDto
}


