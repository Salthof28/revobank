import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { TransactionsRepository } from "./transactions.repository";
// import { AccountsRepository } from "../accounts/accounts.repository";
import { AccountsRepositoryItf } from "../accounts/accounts.repository.interface";

describe('Testing Auth Repository', () => {
    let repositoryAccount: AccountsRepositoryItf;
    let repositoryTransaction: TransactionsRepository;
    let prismaSerMock: PrismaService;
    
    // mock prisma
    const mockPrismaService = {
        transactions: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };
    // mock repository
    const mockAccountRepository = {
        accounts: {
            update: jest.fn(),
        },
    };

    const mockAllTransaction = [
        {
            id: 1,
            account_id: 1,
            destination_account_id: 2,
            transaction_type: "TRANSFER",
            status: "COMPLETED",
            amount: "300000000",
            code_transaction_ref: "TR",
            number_transaction_ref: 1,
            description: "uang coba kirim",
        },
        {
            id: 2,
            account_id: 2,
            destination_account_id: 1,
            transaction_type: "TRANSFER",
            status: "COMPLETED",
            amount: "300000000",
            code_transaction_ref: "TR",
            number_transaction_ref: 2,
            description: "balikin lagi uangnya",
        }
    ]

    //
    beforeEach(async () => {
        // mock module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsRepository,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: 'AccountsRepositoryItf', useValue: mockAccountRepository }
            ],
        }).compile();
        repositoryTransaction = module.get<TransactionsRepository>(TransactionsRepository);
        repositoryAccount = module.get<AccountsRepositoryItf>('AccountsRepositoryItf');
        prismaSerMock = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAll Transaction', async () => {
        mockPrismaService.transactions.findMany.mockResolvedValue(mockAllTransaction);

        const result = await repositoryTransaction.getAll();
        expect(result).toEqual(mockAllTransaction);
        expect(mockPrismaService.transactions.findMany).toHaveBeenCalledWith({where: { OR: undefined }})
    });
})