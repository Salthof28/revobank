export class Account {
    id: number;
    user_id: number;
    account_number: number;
    account_type: string;
    account_name: string; // user name
    balance: number;
    currency: string;
    status: string;
    branch_code: string; // identification bank location when account created
    created_at: string;
    updated_at: string
}
