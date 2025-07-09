import { Inject, Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from './entities/account.entity';
import { AccountNumService, AccountsServiceItf, CreateAccount, GetAllAccounts, UpdateAccount } from './accounts.service.interface';

export interface UpdatedAcc {
    accountNumber: number,
    body: Partial<Account>
}
export interface Pararam {
    accountNumber: number,
}
@Injectable()
export class AccountsService implements AccountsServiceItf {
    constructor(private accountsRepository: AccountsRepository) {}

    getAllAccounts(query: GetAllAccounts) {
        return this.accountsRepository.getAll(query);
    }

    getAccount(params: AccountNumService) {
        return this.accountsRepository.getOne(params)
    }

    updateAccount(paramBody: UpdateAccount) {
        return this.accountsRepository.updated(paramBody)
    }

    createAccount(body: CreateAccount): Account {
        return this.accountsRepository.created(body);
    }

    deleteAccount(param: AccountNumService): Account {
        return this.accountsRepository.deleted(param);
    }
}
