import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

export interface TransactionsRepositoryItf {
    createTransactionFail(body: CreateTransactionDto): Promise<Transaction>;
    // updateTransaction(body: UpdateTransaction): Promise<Transaction>;
    transfer(body: CreateTransactionDto): Promise<Transaction>;
}

export interface UpdateTransaction {
    id: number,
    transaction: UpdateTransactionDto
}