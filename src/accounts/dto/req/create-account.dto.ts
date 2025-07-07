import { IsNumber, IsString } from "class-validator";

export class CreateAccountDto {
    @IsNumber()
    accountNumber: number;
    @IsNumber()
    userId: number;
    @IsString()
    accountType: string;
    @IsString()
    accountName: string;
    @IsNumber()
    balance: number;
    @IsString()
    currency: string;
    @IsString()
    status: string;
    @IsString()
    branchCode: string;
    @IsString()
    createdAt: string;
    @IsString()
    updatedAt: string
}
