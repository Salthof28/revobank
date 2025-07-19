import { AccountStatus, AccountType, Prisma } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
    @IsString()
    account_number: string;
    @IsOptional()
    @IsNumber()
    user_id: number | null;
    @IsEnum(AccountType, { message: 'Invalid account type, must be SAVING, CHECKING, or DEPOSIT' })
    account_type: AccountType;
    @IsString()
    account_name: string;
    @IsNumber()
    balance?: Prisma.Decimal | null;
    @IsString()
    currency: string;
    @IsEnum(AccountStatus, { message: 'Invalid status, must be ACTIVE or INACTIVE' })
    status: AccountStatus;
    @MinLength(6, {message: 'pin is too short (standard 6 character number)',})
    @MaxLength(6, {message: 'pin is too long (standard 6 character number)',})
    @IsString()
    pin: string;
    @IsString()
    branch_code: string;
    // @IsString()
    // created_at: string;
    // @IsString()
    // updated_at: string
}
