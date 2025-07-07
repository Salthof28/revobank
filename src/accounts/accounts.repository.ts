import { Injectable } from "@nestjs/common";
import { Account } from "./entities/account.entity";
import { mockAccounts } from "./mockData/accounts";
import { GetAllAccounts } from "./accounts.repository.interface";


@Injectable()
export class AccountsRepository {

    getAll(accountName: GetAllAccounts) {
        let allAccounts: Account[] = accountName.accountName ? mockAccounts.filter(acc => acc.accountName.toLowerCase().includes(accountName.accountName.toLowerCase())) : mockAccounts;
        // let allAccounts: Account[] = mockAccounts;
        // if(params.accountName) allAccounts = mockAccounts.filter(acc => acc.accountName.includes(params.accountName));
        return allAccounts;
    }
    
    getOne(params: number) {
        let account: Account | undefined = mockAccounts.find(acc => acc.accountNumber === params);
        return account;
    }
}