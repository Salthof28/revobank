import { CreateAccountDto } from "./dto/req/create-account.dto";
import { UpdateAccountDto } from "./dto/req/update-account.dto";
import { Account } from "./entities/account.entity";



export interface AccountsServiceItf {
    getAllAccounts(query?: GetAllAccounts): Promise<Account[]>;
    getAccount(id: number): Promise<Account>;
    updateAccount(paramBody: UpdateAccount): Promise<Account>;
    createAccount(body: CreateAccountDto): Promise<Account>;
    deleteAccount(id: number): Promise<Account>;
}

export interface GetAllAccounts {
    account_name?: string;
    account_number?: string;
    branch_code?: string
}

// export interface AccountNumService {
//     account_number: number;
// }

export interface UpdateAccount {
    id: number;
    account: UpdateAccountDto;
    oldPin?: string;
}
export interface CreateAccount {
    body: CreateAccountDto;
}