import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from './entities/account.entity';
import { AccountsServiceItf, GetAllAccounts, UpdateAccount } from './accounts.service.interface';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { EmailRegisteredException } from 'src/auth/exceptions/email-registered-exception';
import * as bcrypt from 'bcrypt';
import { AccountNotFoundRepositoryException } from './exceptions/account-not-found.exception';
import { NotInputException } from 'src/global/exception/no-input-exception';
import { AccountNumberRegisteredException } from './exceptions/account-number-registered.exception';
import { PinAccountException } from './exceptions/pin.exception';

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

    async getAllAccounts(query: GetAllAccounts): Promise<Account[]> {
        const allAccounts: Account[] | undefined = await this.accountsRepository.getAll(query);
        if(!allAccounts) throw new AccountNotFoundRepositoryException();
        return allAccounts;
    }

    async getAccount(id: number): Promise<Account> {
        const account = await this.accountsRepository.getOne(id);
        if(!account) throw new AccountNotFoundRepositoryException();
        return account
    }

    async createAccount(body: CreateAccountDto): Promise<Account> {
        const checkAccountNumber: Account | undefined = await this.accountsRepository.findAccountNumber(body.account_number);
        if(checkAccountNumber) throw new AccountNumberRegisteredException();
        const saltRounds = 10;
        const pinNotHash = body.pin
        if(pinNotHash.length < 6) throw new PinAccountException();
        else if(pinNotHash.length > 6) throw new PinAccountException('pin is too long (standard 6 character number)');
        body.pin = await bcrypt.hash(pinNotHash, saltRounds);
        return await this.accountsRepository.created(body);
    }

    async updateAccount(paramBody: UpdateAccount): Promise<Account> {
        // check account is it in the database or not
        let account: Account | undefined = await this.accountsRepository.getOne(paramBody.id);
        // check account number registered conflict or not
        if(!account) throw new AccountNotFoundRepositoryException()
        if(paramBody.account.account_number) {
            const checkAccountNumber: Account | undefined = await this.accountsRepository.findAccountNumber(paramBody.account.account_number);
            if(checkAccountNumber) throw new AccountNumberRegisteredException()
        }
        // check parambody bring newpin or not, if bring change the pin
        if(paramBody.account.pin?.trim() && paramBody.oldPin?.trim()){
            const oldPin = paramBody.oldPin
            const isMatchPin = await bcrypt.compare(oldPin, account.pin)
            if(!isMatchPin) throw new PinAccountException('old pin invalid');
            const newPin = paramBody.account.pin.trim();
            if(newPin.length < 6) throw new PinAccountException('pin is too short (standard 6 character number)');
            else if(newPin.length > 6) throw new PinAccountException();
            const newSaltRounds = 10;
            paramBody.account.pin = await bcrypt.hash(newPin, newSaltRounds);
        }
        else if(paramBody.account.pin?.trim() && !paramBody.oldPin?.trim()) throw new PinAccountException('old pin no been input');
        else if(!paramBody.account.pin?.trim() && paramBody.oldPin?.trim()) throw new PinAccountException('new pin no been input');
        account = {...account, ...paramBody.account};
        return this.accountsRepository.updated({
            id: paramBody.id,
            account: account
        })
    }

    async deleteAccount(id: number): Promise<Account> {
        const checkAccount: Account | undefined = await this.accountsRepository.getOne(id);
        if(!checkAccount) throw new AccountNotFoundRepositoryException('user want delete not found in database');
        return await this.accountsRepository.deleted(id);
    }
}
