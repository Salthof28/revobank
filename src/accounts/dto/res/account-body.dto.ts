import { Expose, Type } from "class-transformer";
import { ResponseTransactionDto } from "../../../transactions/dto/res/res-transaction.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
// import { Transaction } from "src/transactions/entities/transaction.entity";


export class AccountBodyResDto {
    @ApiProperty({ example: '4', description: 'account id' })  
    @Expose()
    @Type(() => Number)
    id: number;

    @ApiProperty({ example: '1234', description: 'account number' })   
    @Expose()
    @Type(() => Number)
    account_number: number;

    @ApiPropertyOptional({ example: '4', description: 'user id' })
    @Expose()
    @Type(() => Number)
    user_id: number;

    @ApiProperty({ example: 'SAVING', description: 'only input SAVING or CHECKING or DEPOSIT because value use enum' })
    @Expose()
    @Type(() => String)
    account_type: string;

    @ApiProperty({ example: 'Doe', description: 'user name' })
    @Expose()
    @Type(() => String)
    account_name: string; // user name

    @ApiProperty({ example: '500000000', description: 'balance account' })
    @Expose()
    @Type(() => Number)
    balance: number;

    @ApiProperty({ example: 'IDR', description: 'currency balance' })  
    @Expose()
    @Type(() => String)
    currency: string;

    @ApiProperty({ example: 'ACTIVE', description: 'only input ACTIVE or INACTIVE because value use enum' })   
    @Expose()
    @Type(() => String)
    status: string;

    @ApiProperty({ example: 'JKT002', description: 'code bank created the account' })  
    @Expose()
    @Type(() => String)
    branch_code: string; // identification bank location when account created

    @ApiProperty({ example: '2025-07-18 10:29:21.75+00', description: 'date created account' })   
    @Expose()
    @Type(() => String)
    created_at: string;

    @ApiProperty({ example: '2025-07-18 10:29:21.75+00', description: 'date update account' })
    @Expose()
    @Type(() => String)
    updated_at: string

    @ApiProperty({ example: '[{account_id: 4, ....}, ...]', description: 'all transaction by account_id' })
    @Expose()
    @Type(() => ResponseTransactionDto)
    transactions: ResponseTransactionDto[]

    @ApiProperty({ example: '[{account_id: 4, ....}, ...]', description: 'all transaction by destination_account_id' })
    @Expose()
    @Type(() => ResponseTransactionDto)
    destination_transactions: ResponseTransactionDto[];

}


