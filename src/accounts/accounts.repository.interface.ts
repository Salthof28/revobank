import { CreateAccountDto } from "./dto/req/create-account.dto";
import { UpdateAccountDto } from "./dto/req/update-account.dto";
import { Account } from "./entities/account.entity";

export interface AccountsRepositoryItf {
    getAll(query: GetAll): Account[];
    getOne(paramNumber: AccountNumRepository): Account;
    updated(paramBody: Updated): Account;
    created(body: Created): Account;
    deleted(paramNumber: AccountNumRepository): Account;
}

export interface GetAll {
    account_name: string;
}

export interface AccountNumRepository {
    account_number: number;
}

export interface Updated {
    account_number: number;
    body: Partial<Account>
}
export interface Created {
    body: CreateAccountDto;
}