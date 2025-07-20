import { Injectable } from '@nestjs/common';
import { TransactionsServiceItf } from './transactions.service.interface';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Condition } from 'src/global/entities/condition.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { AccountNotFoundRepositoryException } from 'src/accounts/exceptions/account-not-found.exception';

@Injectable()
export class TransactionsService implements TransactionsServiceItf {
  constructor(private transactionRepository: TransactionsRepository, private accountRepository: AccountsRepository){}

  async transfer(body: CreateTransactionDto): Promise<Transaction> {
    if(body.destination_account_id === null) throw new AccountNotFoundRepositoryException('Please input id account destination');
    // check account id and destination_id
    const [accountSender, accountReceiver] = await Promise.all([
      this.accountRepository.getOne(body.account_id),
      this.accountRepository.getOne(body.destination_account_id),
    ]);
    if (!accountSender) throw new AccountNotFoundRepositoryException('Your account not found');
    if (!accountReceiver) throw new AccountNotFoundRepositoryException('Destination account not found');
    // process transaction
    const processTransaction: Transaction = await this.transactionRepository.transfer(body);
    return processTransaction;
  }

  // create(createTransactionDto: CreateTransactionDto) {
  //   return 'This action adds a new transaction';
  // }

  // findAll() {
  //   return `This action returns all transactions`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`;
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
