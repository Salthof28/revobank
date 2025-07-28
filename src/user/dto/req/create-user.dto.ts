import { RoleUser } from "@prisma/client";
import { IsEmail, IsNumber, IsString, Matches } from "class-validator";
// import { RoleUser } from "generated/prisma";


export class CreateUserDto {
    // @IsNumber()
    // id: number;
    @IsEmail()
    email: string;
    @IsString()
    name: string;
    @Matches(/^\d{10,15}$/, { message: 'Phone must be a valid number' })
    phone: string;
    @Matches(/^\d{16}$/, { message: 'KTP must be 16 digits' })
    number_ktp: string;
    @IsString()
    password: string;
    @IsString()
    role_user: RoleUser
}