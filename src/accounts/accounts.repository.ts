import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Account } from "./entities/account.entity";
import { AccountsRepositoryItf,  GetAll, Update } from "./accounts.repository.interface";
// import { error } from "console";
import { PrismaService } from "prisma/prisma.service";
import { CreateAccountDto } from "./dto/req/create-account.dto";


@Injectable()
export class AccountsRepository implements AccountsRepositoryItf {

    constructor(private prisma: PrismaService){}

    async getAll(query: GetAll): Promise<Account[] | undefined> {
        const where: any = {};
        if(query.account_name || query.account_number || query.branch_code) {
            where.OR = [];
            if(query.account_name) where.OR.push({account_name: query.account_name});
            if(query.account_number) where.OR.push({account_number: query.account_number});
            if(query.branch_code) where.OR.push({branch_code: query.branch_code});
        }
        const allAccounts: Account[] = await this.prisma.accounts.findMany({
            where,
            include: { transactions: true, destination_transactions: true }
        });
        if(allAccounts.length < 1) return undefined;
        return allAccounts;
    }


    async getOne(id: number): Promise<Account | undefined> {
        const account: Account | null = await this.prisma.accounts.findUnique({
            where: {
                id
            },
            include: { transactions: true, destination_transactions: true }
        });
        if(account === null) return undefined;
        return account;
    }

    async findAccountNumber(account_number: string): Promise<Account | undefined> {
        const account: Account | null = await this.prisma.accounts.findUnique({
            where: {
                account_number,
            }
        });
        if(account === null) return undefined;
        return account
    }
    async created(body: CreateAccountDto): Promise<Account> {
        try{
            const newAccount: Account = await this.prisma.accounts.create({
                data: {
                    user_id: body.user_id,
                    account_number: body.account_number,
                    account_type: body.account_type,
                    account_name: body.account_name,
                    balance: body.balance,
                    currency: body.currency,
                    status: body.status,
                    pin: body.pin,
                    branch_code: body.branch_code,
                }
            });
            return newAccount
        } catch (error) {
            if (error.code === 'P2002') {
                throw new HttpException('Account number already exists', HttpStatus.BAD_REQUEST);
            }
            if (error.code === 'P2003') {
                throw new HttpException('Invalid user_id', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Failed to create account', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updated(paramBody: Update): Promise<Account> {
        const updateAccount: Account = await this.prisma.accounts.update({
            where: {
                id: paramBody.id
            },
            data: {
                user_id: paramBody.account.user_id, 
                account_number: paramBody.account.account_number,
                account_type: paramBody.account.account_type,
                account_name: paramBody.account.account_name,
                balance: paramBody.account.balance,
                currency: paramBody.account.currency,
                status: paramBody.account.status,
                pin: paramBody.account.pin,
                branch_code: paramBody.account.branch_code,
                updated_at: new Date,
            },
            include: { transactions: true, destination_transactions: true }
        });
        return updateAccount;
    }

    async deleted(id: number): Promise<Account> {
        const deleteAccount: Account = await this.prisma.accounts.delete({
            where: {
                id
            }
        });
        return deleteAccount;
    }
}