import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionDto } from "./dto/req/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/req/update-transaction.dto";


export interface TransactionsServiceItf {
    getAllTransaction(query?: AllqueryTransac): Promise<Transaction[]>
    getOneTransaction(id: number): Promise<Transaction>
    updateTransaction(paramBody: UpdateTransac): Promise<Transaction>
    transactionTransfer(transferData: TransactionDat): Promise<Transaction>;
    transactionWithdraw(withdrawData: TransactionDat): Promise<Transaction>;
    transactionDeposit(depositData: TransactionDat): Promise<Transaction>;
}

export interface UpdateTransac {
    id: number,
    transaction: UpdateTransactionDto
}
export interface AllqueryTransac {
    transaction_type?: string,
    status?: string,
    code_transaction_ref?: string
}

export interface TransactionDat {
    pinAccount: string,
    body: CreateTransactionDto
}