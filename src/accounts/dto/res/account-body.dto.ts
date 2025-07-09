import { Expose, Type } from "class-transformer";


export class AccountBodyResDto {
    // @Expose()
    // @Type(() => Number)
    // accountNumber: number;
    @Expose()
    @Type(() => Number)
    userId: number;
    @Expose()
    @Type(() => String)
    accountType: string;
    @Expose()
    @Type(() => String)
    accountName: string; // user name
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
    branchCode: string; // identification bank location when account created
    @Expose()
    @Type(() => String)
    createdAt: string;
    @Expose()
    @Type(() => String)
    updatedAt: string
}


