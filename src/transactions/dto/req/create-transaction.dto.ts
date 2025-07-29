import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CodeTypeTransaction, Prisma, TransactionStatus, TransactionType } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @ApiProperty({ example: '4', description: 'account id' })  
    @IsNumber()
    account_id: number;

    @ApiProperty({ example: '2', description: 'account id destination' }) 
    @IsOptional()
    @IsNumber()
    destination_account_id: number;

    @ApiProperty({ example: 'TRANSFER', description: 'only input TRANSFER or DEPOSIT or WITHDRAW because value use enum' })
    @IsString()
    transaction_type: TransactionType;

    @ApiProperty({ example: 'COMPLETED', description: 'only input COMPLETED or FAILED or PENDING because value use enum' })    
    @IsString()
    status: TransactionStatus; 

    @ApiProperty({ example: '50000000', description: 'amount transaction' })
    @IsNumber()
    amount: Prisma.Decimal;

    @ApiProperty({ example: 'TR', description: 'only input TR or WH or DP because value use enum' })    
    @IsString()
    code_transaction_ref: CodeTypeTransaction;

    @ApiPropertyOptional({ example: 'test transfer money', description: 'note transaction' }) 
    @IsOptional()
    @IsString()
    description: string | null;
}
