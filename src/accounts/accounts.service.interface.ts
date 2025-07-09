import { CreateAccountDto } from "./dto/req/create-account.dto";
import { Account } from "./entities/account.entity";



export interface AccountsServiceItf {
    getAllAccounts(query: GetAllAccounts): Account[];
    getAccount(param: AccountNumService): Account;
    updateAccount(paramBody: UpdateAccount): Account;
    createAccount(body: CreateAccount): Account;
    deleteAccount(param: AccountNumService): Account;
}

export interface GetAllAccounts {
    accountName: string;
}

export interface AccountNumService {
    accountNumber: number;
}

export interface UpdateAccount {
    accountNumber: number;
    body: Partial<Account>
}
export interface CreateAccount {
    body: CreateAccountDto;
}