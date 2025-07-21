import { Expose, Type } from "class-transformer";
import { AccountBodyResDto } from "src/accounts/dto/res/account-body.dto";
import { Account } from "src/accounts/entities/account.entity";

export class UserBodyDto {
    @Expose()
    @Type(() => Number)
    id: number;

    @Expose()
    @Type(() => String)
    email: string;

    @Expose()
    @Type(() => String)
    name: string;

    @Expose()
    @Type(() => String)
    phone: string;

    @Expose()
    @Type(() => String)
    number_ktp: string;

    @Expose()
    @Type(() => String)
    role_user: string

    @Expose()
    @Type(() => String)
    created_at: string;
    @Expose()
    @Type(() => String)
    updated_at: string

    @Expose()
    @Type(() => AccountBodyResDto)
    accounts: Account[]

}