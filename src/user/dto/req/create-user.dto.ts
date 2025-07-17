import { RoleUser } from "@prisma/client";
import { IsNumber, IsString } from "class-validator";
// import { RoleUser } from "generated/prisma";


export class CreateUserDto {
    // @IsNumber()
    // id: number;
    @IsString()
    email: string;
    @IsString()
    name: string;
    @IsString()
    phone: string;
    @IsString()
    number_ktp: string;
    @IsString()
    password: string;
    @IsString()
    role_user: RoleUser
}