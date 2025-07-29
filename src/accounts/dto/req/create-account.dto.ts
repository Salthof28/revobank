import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AccountStatus, AccountType, Prisma } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
    @ApiProperty({ example: '1234', description: 'account number' })
    @IsString()
    account_number: string;

    @ApiPropertyOptional({ example: '4', description: 'user id' })
    @IsOptional()
    @IsNumber()
    user_id: number | null;

    @ApiProperty({ example: 'SAVING', description: 'only input SAVING or CHECKING or DEPOSIT because value use enum' })
    @IsEnum(AccountType, { message: 'Invalid account type, must be SAVING, CHECKING, or DEPOSIT' })
    account_type: AccountType;

    @ApiProperty({ example: 'Doe', description: 'user name' })
    @IsString()
    account_name: string;

    @ApiProperty({ example: '500000000', description: 'balance account' })
    @IsNumber()
    balance?: Prisma.Decimal | null;

    @ApiProperty({ example: 'IDR', description: 'currency balance' })
    @IsString()
    currency: string;

    @ApiProperty({ example: 'ACTIVE', description: 'only input ACTIVE or INACTIVE because value use enum' })
    @IsEnum(AccountStatus, { message: 'Invalid status, must be ACTIVE or INACTIVE' })
    status: AccountStatus;

    @ApiProperty({ example: '123456', description: 'pin account, only 6 character input' })
    @MinLength(6, {message: 'pin is too short (standard 6 character number)',})
    @MaxLength(6, {message: 'pin is too long (standard 6 character number)',})
    @IsString()
    pin: string;

    @ApiProperty({ example: 'JKT002', description: 'code bank created the account' })
    @IsString()
    branch_code: string;
}
