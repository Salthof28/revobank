import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import { CodeTypeTransaction, TransactionType } from '@prisma/client';
import { UpdateTransactionDto } from './dto/req/update-transaction.dto';

export interface TransactionsRepositoryItf {
    getAll(query?: Allquery): Promise<Transaction[] | undefined>
    getOne(id: number): Promise<Transaction | undefined>
    updateTransaction(body: UpdateTransaction): Promise<Transaction>
    createTransactionFail(body: CreateTransactionDto): Promise<Transaction>;
    withdraw(body: CreateTransactionDto): Promise<Transaction>;
    transfer(body: CreateTransactionDto): Promise<Transaction>;
    deposit(body: CreateTransactionDto): Promise<Transaction>;
}

export interface UpdateTransaction {
    id: number,
    transaction: UpdateTransactionDto
}

export interface Allquery {
    transaction_type?: string,
    status?: string,
    code_transaction_ref?: string
}