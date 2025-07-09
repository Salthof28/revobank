import { Injectable, NotFoundException } from "@nestjs/common";
import { Account } from "./entities/account.entity";
import { mockAccounts } from "./mockData/accounts";
import { AccountsRepositoryItf, AccountNumRepository, GetAll, Updated, Created } from "./accounts.repository.interface";
// import { error } from "console";
import { AccountNotFoundRepositoryException } from "./exceptions/account-not-found.exception";


@Injectable()
export class AccountsRepository implements AccountsRepositoryItf {

    getAll(query: GetAll): Account[] {
        let allAccounts: Account[] = query.accountName ? mockAccounts.filter(acc => acc.accountName.toLowerCase().includes(query.accountName.toLowerCase())) : mockAccounts;
        return allAccounts;
    }
    
    getOne(param: AccountNumRepository): Account {
        let account: Account | undefined = mockAccounts.find((acc) =>acc.accountNumber === param.accountNumber);
        if(!account) throw new AccountNotFoundRepositoryException();
        return account;
    }

    updated(paramBody: Updated): Account {
        const findAccountId: number = this.getOne(paramBody).accountNumber;
        const indexAccount: number = mockAccounts.findIndex(acc => acc.accountNumber === findAccountId);
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
        const findIndexAccount = mockAccounts.findIndex(acc => acc.accountNumber === paramNumber.accountNumber);
        // console.log(findIndexAccount);
        if(findIndexAccount === -1) throw new AccountNotFoundRepositoryException();
        const deleteAccount = mockAccounts[findIndexAccount];
        mockAccounts.splice(findIndexAccount, 1);
        return deleteAccount;
    }
}