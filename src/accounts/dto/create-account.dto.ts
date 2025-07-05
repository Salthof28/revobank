import { IsNumber, IsString } from "class-validator";

export class CreateAccountDto {
    // @IsNumber()
    // userId: number;
    @IsString()
    accountName: string;
    @IsNumber()
    balance: number;
    @IsString()
    accountType: string;
    // @IsString()
    // createdAt: string;
    // @IsString()
    // updatedAt: string
}
