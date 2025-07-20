import { CodeTypeTransaction, Prisma, TransactionStatus, TransactionType } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNumber()
    account_id: number;
    @IsOptional()
    @IsNumber()
    destination_account_id: number;
    @IsString()
    transaction_type: TransactionType;
    @IsString()
    status: TransactionStatus; 
    @IsNumber()
    amount: Prisma.Decimal;
    @IsString()
    code_transaction_ref: CodeTypeTransaction;
    @IsOptional()
    @IsString()
    description: string | null;
    // created_at: Date | null;
    // updated_at: Date | null;
}
