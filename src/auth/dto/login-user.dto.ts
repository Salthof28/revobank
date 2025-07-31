import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'taiga@mail.com or jane@mail.com', description: 'user email' })
    @IsString()
    email: string;
    @ApiProperty({ example: 'taiga123 or jane123', description: 'user password' })
    @IsString()
    password: string;
}
