import { Account } from "./entities/account.entity";

export interface AccountsRepositoryItf {
    getAllAccounts(param: GetAllAccounts): Account[];
}

export interface GetAllAccounts {
    accountName: string;
}