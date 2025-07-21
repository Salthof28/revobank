import { Injectable } from '@nestjs/common';
import { AllqueryTransac, TransactionsServiceItf, UpdateTransac } from './transactions.service.interface';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import { AccountNotFoundRepositoryException } from 'src/accounts/exceptions/account-not-found.exception';
import { StatusAccountException } from './exceptions/status-account-exception';
import { Account } from 'src/accounts/entities/account.entity';
import { InvalidTypeTransactionException } from './exceptions/invalid-type-transaction-exception';
import { TransactionNotFound } from './exceptions/transaction-not-found-exception';

@Injectable()
export class TransactionsService implements TransactionsServiceItf {
  constructor(private transactionRepository: TransactionsRepository, private accountRepository: AccountsRepository){}

  async getAllTransaction(query: AllqueryTransac): Promise<Transaction[]> {
    const allTransaction: Transaction[] | undefined = await this.transactionRepository.getAll(query);
    if(!allTransaction) throw new TransactionNotFound()
    return allTransaction;
  }

  async getOneTransaction(id: number): Promise<Transaction> {
    const transaction: Transaction | undefined = await this.transactionRepository.getOne(id);
    if(!transaction) throw new TransactionNotFound();
    return transaction;
  }

  async updateTransaction(paramBody: UpdateTransac): Promise<Transaction> {
    const updateTransaction: Transaction = await this.transactionRepository.updateTransaction(paramBody);
    return updateTransaction;
  }

  async transactionTransfer(body: CreateTransactionDto): Promise<Transaction> {
    // check transaction type and TR
    if(body.transaction_type !== "TRANSFER") throw new InvalidTypeTransactionException();
    if(body.code_transaction_ref !== "TR") throw new InvalidTypeTransactionException('invalid code_transaction_type');
    // check account id receiver
    if(body.destination_account_id === null) throw new AccountNotFoundRepositoryException('Please input id account destination');
    // check account id and destination_id
    const [accountSender, accountReceiver] = await Promise.all([
      this.accountRepository.getOne(body.account_id),
      this.accountRepository.getOne(body.destination_account_id),
    ]);
    if (!accountSender) throw new AccountNotFoundRepositoryException('Your account not found');
    if (!accountReceiver) throw new AccountNotFoundRepositoryException('Destination account not found');
    // check account status
    if(accountSender.status === 'INACTIVE') throw new StatusAccountException();
    if(accountReceiver.status === 'INACTIVE') throw new StatusAccountException('account receiver INACTIVE cannot transfer');
    // check balance
    const balanceaAccountSender = accountSender.balance ? accountSender.balance : 0; 
    if(balanceaAccountSender < body.amount) return await this.transactionRepository.createTransactionFail(body);
    // process transaction
    const processTransaction: Transaction = await this.transactionRepository.transfer(body);
    return processTransaction;
  }

  async transactionWithdraw(body: CreateTransactionDto): Promise<Transaction> {
    // check transaction type and TR
    if(body.transaction_type !== "WITHDRAW") throw new InvalidTypeTransactionException();
    if(body.code_transaction_ref !== "WH") throw new InvalidTypeTransactionException('invalid code_transaction_type');
    // check account
    const account: Account | undefined = await this.accountRepository.getOne(body.account_id);
    if (!account) throw new AccountNotFoundRepositoryException('Your account not found');
    // check account status
    if(account.status === 'INACTIVE') throw new StatusAccountException();
    // check balance
    const balanceAccount = account.balance ? account.balance : 0;
    if(balanceAccount < body.amount) return await this.transactionRepository.createTransactionFail(body);
    // process withdraw
    const processWithdraw: Transaction = await this.transactionRepository.withdraw(body);
    return processWithdraw;
  }

  async transactionDeposit(body: CreateTransactionDto): Promise<Transaction> {
    // check transaction type and TR
    if(body.transaction_type !== "DEPOSIT") throw new InvalidTypeTransactionException();
    if(body.code_transaction_ref !== "DP") throw new InvalidTypeTransactionException('invalid code_transaction_type');
    // check account
    const account: Account | undefined = await this.accountRepository.getOne(body.account_id);
    if (!account) throw new AccountNotFoundRepositoryException('Your account not found');
    // check account status
    if(account.status === 'INACTIVE') throw new StatusAccountException();
    // process deposit
    const processDeposit: Transaction = await this.transactionRepository.deposit(body);
    return processDeposit;
  }

}
