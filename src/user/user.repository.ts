// import { mockUsers } from "./data/mock-user";
import { User } from "./entities/user.entity";
import {  Updated, UserRepositoryItf } from "./user.repository.interface";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/req/create-user.dto";
import { Condition } from "src/global/entities/condition.entity";

// because function callback, we use promisify to be able use in async await function. scrypt change password to string

// implements UserRepositoryItf
@Injectable()
export class UserRepository implements UserRepositoryItf  {

    constructor(private prisma: PrismaService) {
        // console.log('time:', new Date());
        // if (!this.prisma) {
        //     throw new Error('PrismaService is not initialized');
        // }
    }
    async getAll(name?: string): Promise<User[] | undefined> {
        const allUsers: User[] | null = await this.prisma.users.findMany({
            where: {
                name
            },
            include: { accounts: true }
        });
        if(allUsers === null) return undefined;
        return allUsers;
    }
    async getOne(id: number): Promise<User | undefined> {
        const user: User | null = await this.prisma.users.findUnique({
            where: {
                id
            },
            include: { accounts: true }
        })
        if(!user) return undefined;
        return user;
    }

    async findExistingUser(condition: Condition[]): Promise<User | undefined> {
        const existingUser = await this.prisma.users.findFirst({
            // where: { 
            //             OR: [
            //                 { email: 'coba@email.com' },
            //                 { phone: '0837463823' },
            //                 { number_ktp: '3245673' }
            //             ]
            //         }
            where: { OR: condition }
        })
        if(existingUser === null) return undefined;
        return existingUser
    }

    async findEmail(email: string): Promise<User | undefined> {
        try{
            const user = await this.prisma.users.findUnique({
                where: {
                    email,
                },
            });
            if(user === null) return undefined;
            return user;
            
        } catch (error) {
            if (error.code === 'P2002') {
                throw new HttpException('Account number already exists', HttpStatus.BAD_REQUEST);
            }
            if (error.code === 'P2003') {
                throw new HttpException('Invalid user_id', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Failed to create account', HttpStatus.INTERNAL_SERVER_ERROR);
        }

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
                updated_at: new Date(),
            },
            include: { accounts: true }
        })
        return updateUser;
    }

}