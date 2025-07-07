import { Account } from "../entities/account.entity";

// 84302924
export const mockAccounts: Account[] = [
    {
        accountNumber: 5221,
        userId: 1,
        accountType: 'SAVING',
        accountName: 'John Doe', // user name
        balance: 50000000,
        currency: 'IDR',
        status: 'active',
        branchCode: 'JKT032', // identification bank location when account created
        createdAt: '22/07/2019',
        updatedAt: '21/05/2024',
    },
    {
        accountNumber: 8430,
        userId: 2,
        accountType: 'SAVING',
        accountName: 'Lenon', // user name
        balance: 100000000,
        currency: 'IDR',
        status: 'active',
        branchCode: 'JKT022', // identification bank location when account created
        createdAt: '22/07/2018',
        updatedAt: '21/05/2022',
    }
]