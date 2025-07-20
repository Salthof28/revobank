import { CodeTypeTransaction, Prisma, TransactionStatus, TransactionType } from "@prisma/client";

export class Transaction { 
        id: number;
        account_id: number;
        destination_account_id: number | null;
        transaction_type: TransactionType;
        status: TransactionStatus; // user name
        amount: Prisma.Decimal | null; 
        code_transaction_ref: CodeTypeTransaction;
        number_transaction_ref: number;
        description: string | null;
        created_at: Date | null;
        updated_at: Date | null;
}
