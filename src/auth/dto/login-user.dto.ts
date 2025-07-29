import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'doe@mail.com', description: 'user email' })
    @IsString()
    email: string;
    @ApiProperty({ example: 'doe123', description: 'user password' })
    @IsString()
    password: string;
}
