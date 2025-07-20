import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";


export interface TransactionsServiceItf {
    transfer(body: CreateTransactionDto): Promise<Transaction>;
}