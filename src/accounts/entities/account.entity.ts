import { AccountStatus, AccountType, Prisma } from "@prisma/client";

export class Account {
    id: number;
    user_id: number | null;
    account_number: string;
    account_type: AccountType;
    account_name: string; // user name
    balance: Prisma.Decimal | null;
    currency: string;
    status: AccountStatus;
    pin: string; 
    branch_code: string; // identification bank location when account created
    created_at: Date | null;
    updated_at: Date | null;
}
