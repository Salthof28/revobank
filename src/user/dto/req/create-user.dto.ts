import { IsNumber, IsString } from "class-validator";


export class CreateUserDto {
    @IsNumber()
    id: number;
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
    role: string
}