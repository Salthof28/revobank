import { Injectable, NotFoundException } from "@nestjs/common";
import { Account } from "./entities/account.entity";
import { mockAccounts } from "./mockData/accounts";
import { AccountsRepositoryItf, AccountNumRepository, GetAll, Updated, Created } from "./accounts.repository.interface";
// import { error } from "console";
import { AccountNotFoundRepositoryException } from "./exceptions/account-not-found.exception";


@Injectable()
export class AccountsRepository implements AccountsRepositoryItf {

    getAll(query: GetAll): Account[] {
        let allAccounts: Account[] = query.account_name ? mockAccounts.filter(acc => acc.account_name.toLowerCase().includes(query.account_name.toLowerCase())) : mockAccounts;
        return allAccounts;
    }
    
    getOne(param: AccountNumRepository): Account {
        let account: Account | undefined = mockAccounts.find((acc) =>acc.account_number === param.account_number);
        if(!account) throw new AccountNotFoundRepositoryException();
        return account;
    }

    updated(paramBody: Updated): Account {
        const findAccountId: number = this.getOne(paramBody).account_number;
        const indexAccount: number = mockAccounts.findIndex(acc => acc.account_number === findAccountId);
        let account = mockAccounts[indexAccount]
        account ={ ...account, ...paramBody.body }
        mockAccounts[indexAccount] = account;
        return account;
    }

    created(body: Created): Account {
        const newAccount = body.body;
        mockAccounts.push(newAccount);
        return newAccount;
    }

    deleted(paramNumber: AccountNumRepository): Account {
        const findIndexAccount = mockAccounts.findIndex(acc => acc.account_number === paramNumber.account_number);
        // console.log(findIndexAccount);
        if(findIndexAccount === -1) throw new AccountNotFoundRepositoryException();
        const deleteAccount = mockAccounts[findIndexAccount];
        mockAccounts.splice(findIndexAccount, 1);
        return deleteAccount;
    }
}