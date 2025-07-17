// import { mockUsers } from "./data/mock-user";
import { User } from "./entities/user.entity";
import { users } from "@prisma/client"
import {  Updated, UserRepositoryItf } from "./user.repository.interface";
import { UserNotFoundException } from "./exceptions/user-not-found.exception";
import { HttpStatus, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { scrypt as _scrypt, randomBytes } from "crypto"; // change name function callback to _scrypt
import { promisify } from "util";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto } from "./dto/req/create-user.dto";
import { UpdateUserDto } from "./dto/req/update-user.dto";
// import { PrismaService } from "../../prisma/prisma.service";

// because function callback, we use promisify to be able use in async await function. scrypt change password to string
const scrypt = promisify(_scrypt);

// implements UserRepositoryItf
@Injectable()
export class UserRepository implements UserRepositoryItf  {

    constructor( private prisma: PrismaService) {
        // console.log('PrismaService in UserRepository:', this.prisma);
        // if (!this.prisma) {
        //     throw new Error('PrismaService is not initialized');
        // }
    }
    // getAll(query: GetAll) {
    //     const allUsers: User[] = query.name ? mockUsers.filter(user => user.name.toLowerCase().includes(query.name.toLowerCase())) : mockUsers;
    //     return allUsers;
    // }

    // getOne(param: GetOne): User {
    //     const user: User | undefined = mockUsers.find(user => user.id === param.id);
    //     if(!user) throw new UserNotFoundException();
    //     return user;
    // }

    // updated(paramBody: Updated): User {
    //     const indexUser = mockUsers.findIndex(user => user.id === paramBody.id);
    //     if(indexUser === -1) throw new UserNotFoundException();
    //     let updatedUser = mockUsers[indexUser];
    //     updatedUser = {...updatedUser, ...paramBody.body};
    //     mockUsers[indexUser] = updatedUser;
    //     return updatedUser;
    // }
    
    async getOne(id: number): Promise<User | undefined> {
        const user: User | null = await this.prisma.users.findUnique({
            where: {
                id
            }
        })
        if(!user) return undefined;
        return user;
    }

    async findEmail(email: string): Promise<User | undefined> {
        const user = await this.prisma.users.findUnique({
            where: {
                email,
            },
        });
        if(user === null) return undefined;
        return user;
    }

    async findPhone(phone: string): Promise<User | undefined> {
        const user = await this.prisma.users.findUnique({
            where: {
                phone
            }
        });
        if(user === null) return undefined;
        return user
    }

    async findKtp(number_ktp: string): Promise<User | undefined> {
        const user = await this.prisma.users.findUnique({
            where: {
                number_ktp
            }
        });
        if(user === null) return undefined;
        return user
    }

    async created(body: CreateUserDto): Promise<User> {   
        const newUser = await this.prisma.users.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                number_ktp: body.number_ktp,
                password: body.password,
                role_user: body.role_user,
            }
        });
        return newUser;
    }

    async updated(user: Updated): Promise<User> {
        const updateUser = await this.prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                name: user.body.name,
                email: user.body.email,
                phone: user.body.phone,
                number_ktp: user.body.number_ktp,
                password: user.body.password,
                role_user: user.body.role_user,
            }
        })
        return updateUser;
    }

    // updated(paramBody: Updated): User {
    //     const indexUser = mockUsers.findIndex(user => user.id === paramBody.id);
    //     if(indexUser === -1) throw new UserNotFoundException();
    //     let updatedUser = mockUsers[indexUser];
    //     updatedUser = {...updatedUser, ...paramBody.body};
    //     mockUsers[indexUser] = updatedUser;
    //     return updatedUser;
    // }
}