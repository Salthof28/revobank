import { Injectable } from '@nestjs/common';
import { TransactionsRepositoryItf, UpdateTransaction } from './transactions.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsRepository implements TransactionsRepositoryItf {
    constructor(private prisma: PrismaService, private accountsRepository: AccountsRepository){}

    // async createTransactionHistory(body: CreateTransactionDto): Promise<Transaction> {
    //     const transfer: Transaction = await this.prisma.transactions.create({
    //         data: {
    //             account_id: body.account_id,
    //             destination_account_id: body.destination_account_id,
    //             transaction_type: body.transaction_type,
    //             status: body.status,
    //             amount: body.amount,
    //             code_transaction_ref: body.code_transaction_ref,
    //             description: body.description,
    //         }
    //     });
    //     return transfer;
    // }

    // async updateTransaction(body: UpdateTransaction): Promise<Transaction> {
    //     const updateTransfer: Transaction = await this.prisma.transactions.update({
    //         where: {
    //             id: body.id
    //         },
    //         data: {
    //             account_id: body.transaction.account_id,
    //             destination_account_id: body.transaction.destination_account_id,
    //             transaction_type: body.transaction.transaction_type,
    //             status: body.transaction.status,
    //             amount: body.transaction.amount,
    //             code_transaction_ref: body.transaction.code_transaction_ref,
    //             description: body.transaction.description,
    //             updated_at: new Date,
    //         }
    //     });
    //     return updateTransfer;
    // }

    async transfer(body: CreateTransactionDto): Promise<Transaction> {
        try{
            const resultTransfer = await this.prisma.$transaction([
                this.prisma.accounts.update({
                    where: { id: body.account_id },
                    data: { balance: { decrement: body.amount } }
                }),
                this.prisma.accounts.update({
                    where: { id: body.destination_account_id },
                    data: { balance: { increment: body.amount } }
                }),
                this.prisma.transactions.create({
                    data: {
                        account_id: body.account_id,
                        destination_account_id: body.destination_account_id,
                        transaction_type: body.transaction_type,
                        status: body.status,
                        amount: body.amount,
                        code_transaction_ref: body.code_transaction_ref,
                        description: body.description,
                    }
                })
            ]);
            return resultTransfer[2];
        } catch (error) {
            throw new Error('Transfer failed, rolled back');
        }

    }
}