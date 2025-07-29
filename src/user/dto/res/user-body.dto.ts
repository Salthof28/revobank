import { Expose, Type } from "class-transformer";
import { AccountBodyResDto } from "../../../accounts/dto/res/account-body.dto";
import { Account } from "../../../accounts/entities/account.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserBodyDto {
    @ApiProperty({ example: '4', description: 'user id' })
    @Expose()
    @Type(() => Number)
    id: number;
    @ApiProperty({ example: 'doe@mail.com', description: 'user email' })
    @Expose()
    @Type(() => String)
    email: string;
    @ApiProperty({ example: 'Doe', description: 'user name' })
    @Expose()
    @Type(() => String)
    name: string;
    @ApiProperty({ example: '0821231212321', description: 'user phone' })
    @Expose()
    @Type(() => String)
    phone: string;
    @ApiProperty({ example: '3213123121232316', description: 'user ktp (16 character)' })
    @Expose()
    @Type(() => String)
    number_ktp: string;
    @ApiProperty({ example: 'CUSTOMER', description: 'only input CUSTOMER or ADMIN because value use enum' })
    @Expose()
    @Type(() => String)
    role_user: string
    @ApiProperty({ example: '2025-07-18 10:29:21.75+00', description: 'date create user' })
    @Expose()
    @Type(() => String)
    created_at: string;
    @ApiProperty({ example: '2025-07-18 10:29:21.75+00', description: 'date update user' })
    @Expose()
    @Type(() => String)
    updated_at: string
    @ApiProperty({ example: '[{account_name: Doe, ....}, ...]', description: 'all accounts user' })
    @Expose()
    @Type(() => AccountBodyResDto)
    accounts: Account[]

}