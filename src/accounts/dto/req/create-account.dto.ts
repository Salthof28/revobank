import { IsNumber, IsString } from "class-validator";

export class CreateAccountDto {
    @IsNumber()
    id: number;
    @IsNumber()
    account_number: number;
    @IsNumber()
    user_id: number;
    @IsString()
    account_type: string;
    @IsString()
    account_name: string;
    @IsNumber()
    balance: number;
    @IsString()
    currency: string;
    @IsString()
    status: string;
    @IsString()
    branch_code: string;
    @IsString()
    created_at: string;
    @IsString()
    updated_at: string
}
