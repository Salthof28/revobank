import { Expose, Type } from "class-transformer";


export class AccountBodyResDto {
    @Expose()
    @Type(() => Number)
    id: number;
    @Expose()
    @Type(() => Number)
    account_number: number;
    @Expose()
    @Type(() => Number)
    user_id: number;
    @Expose()
    @Type(() => String)
    account_type: string;
    @Expose()
    @Type(() => String)
    account_name: string; // user name
    @Expose()
    @Type(() => Number)
    balance: number;
    @Expose()
    @Type(() => String)
    currency: string;
    @Expose()
    @Type(() => String)
    status: string;
    @Expose()
    @Type(() => String)
    branch_code: string; // identification bank location when account created
    @Expose()
    @Type(() => String)
    created_at: string;
    @Expose()
    @Type(() => String)
    updated_at: string
}


