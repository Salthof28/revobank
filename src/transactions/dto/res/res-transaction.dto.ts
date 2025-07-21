import { Expose, Type } from "class-transformer";


export class ResponseTransactionDto {
    @Expose()
    @Type(() => Number)
    id: number;
    @Expose()
    @Type(() => Number)
    account_id: number;
    @Expose()
    @Type(() => Number)
    destination_account_id: number;
    @Expose()
    @Type(() => String)
    transaction_type: string;
    @Expose()
    @Type(() => String)
    status: string; 
    @Expose()
    @Type(() => Number)
    amount: number;
    @Expose()
    @Type(() => String)
    code_transaction_ref: string;
    @Expose()
    @Type(() => String)
    description: string | null;
    @Expose()
    @Type(() => String)
    updated_at: Date | null;
}