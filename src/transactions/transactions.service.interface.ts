import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";


export interface TransactionsServiceItf {
    getAllTransaction(query: AllqueryTransac): Promise<Transaction[]>
    getOneTransaction(id: number): Promise<Transaction>
    updateTransaction(paramBody: UpdateTransac): Promise<Transaction>
    transactionTransfer(body: CreateTransactionDto): Promise<Transaction>;
    transactionWithdraw(body: CreateTransactionDto): Promise<Transaction>;
    transactionDeposit(body: CreateTransactionDto): Promise<Transaction>;
}

export interface UpdateTransac {
    id: number,
    transaction: UpdateTransactionDto
}
export interface AllqueryTransac {
    transaction_type: string,
    status: string,
    code_transaction_ref: string
}