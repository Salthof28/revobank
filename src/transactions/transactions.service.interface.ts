import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";


export interface TransactionsServiceItf {
    transactionTransfer(body: CreateTransactionDto): Promise<Transaction>;
    transactionWithdraw(body: CreateTransactionDto): Promise<Transaction>;
    transactionDeposit(body: CreateTransactionDto): Promise<Transaction>;
}