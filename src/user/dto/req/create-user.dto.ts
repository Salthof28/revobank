import { ApiProperty } from "@nestjs/swagger";
import { RoleUser } from "@prisma/client";
import { IsEmail, IsNumber, IsString, Matches } from "class-validator";
// import { RoleUser } from "generated/prisma";


export class CreateUserDto {
    @ApiProperty({ example: 'doe@mail.com', description: 'user email' })
    @IsEmail()
    email: string;
    @ApiProperty({ example: 'Doe', description: 'user name' })
    @IsString()
    name: string;
    @ApiProperty({ example: '0821231212321', description: 'user phone' })
    @Matches(/^\d{10,15}$/, { message: 'Phone must be a valid number' })
    phone: string;
    @ApiProperty({ example: '3213123121232316', description: 'user ktp (16 character)' })
    @Matches(/^\d{16}$/, { message: 'KTP must be 16 digits' })
    number_ktp: string;
    @ApiProperty({ example: 'doe123', description: 'user password' })
    @IsString()
    password: string;
    @ApiProperty({ example: 'CUSTOMER', description: 'only input CUSTOMER or ADMIN because value use enum' })
    @IsString()
    role_user: RoleUser
}