import { Expose, Type } from "class-transformer";

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
}