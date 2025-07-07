import { Inject, Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
    constructor(private accountsRepository: AccountsRepository) {}

    getAllAccounts(query: string) {
        return this.accountsRepository.getAll({
            accountName: query,
        });
    }
}
