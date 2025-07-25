import { CreateAccountDto } from "./dto/req/create-account.dto";
import { UpdateAccountDto } from "./dto/req/update-account.dto";
import { Account } from "./entities/account.entity";

export interface AccountsRepositoryItf {
    getAll(query?: GetAll): Promise<Account[] | undefined>;
    getOne(id: number): Promise<Account | undefined>;
    updated(paramBody: Update): Promise<Account>;
    findAccountNumber(account_number: string): Promise<Account | undefined>
    created(body: CreateAccountDto): Promise<Account>;
    deleted(id: number): Promise<Account>;
}

export interface GetAll {
    account_name?: string;
    account_number?: string;
    branch_code?: string
}

export interface Created {
    body: CreateAccountDto;
}

export interface Update {
    id: number;
    account: UpdateAccountDto;
}