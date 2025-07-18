import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/req/update-user.dto";
import { CreateUserDto } from "./dto/req/create-user.dto";
import { Condition } from "src/global/entities/condition.entity";


export interface UserRepositoryItf {
    getAll(name: string): Promise<User[] | undefined>;
    getOne(id: number): Promise<User | undefined>;
    updated(paramBody: Updated): Promise<User>;
    created(body: CreateUserDto): Promise<User>;
    findEmail(email: string): Promise<User | undefined>;
    // findPhone(phone: string): Promise<User | undefined>;
    // findKtp(number_ktp: string): Promise<User | undefined>;
    findExistingUser(condition: Condition[]): Promise<User | undefined>
}

export interface Updated {
    id?: number,
    body: UpdateUserDto
}


