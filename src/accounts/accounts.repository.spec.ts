import { Test, TestingModule } from '@nestjs/testing';
import { AccountsRepository } from './accounts.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountStatus, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Update } from './accounts.repository.interface';


describe('AccountsRepository', () => {
    let repository: AccountsRepository;
    let prismaSerMock: PrismaService;
    
    const mockAllAccount = [
        {
            id: 1,
            account_number: "4121",
            user_id: 1,
            account_type: "SAVING",
            account_name: "Jane",
            balance: 495000000,
            currency: "IDR",
            pin: '123456',
            status: "ACTIVE",
            branch_code: "JKT002",
        },
        {
            id: 2,
            account_number: "8431",
            user_id: 2,
            account_type: "SAVING",
            account_name: "John Doe",
            balance: 40450000,
            currency: "IDR",
            pin: '123456',
            status: "ACTIVE",
            branch_code: "JKT002",
        }
    ]

    const mockPrismaService = {
        accounts: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            AccountsRepository,
            { provide: PrismaService, useValue: mockPrismaService }
        ],
        }).compile();

        repository = module.get<AccountsRepository>(AccountsRepository);
        prismaSerMock = module.get<PrismaService>(PrismaService);
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAll user', async () => {
        mockPrismaService.accounts.findMany.mockResolvedValue(mockAllAccount);

        const result = await repository.getAll();
        expect(result).toEqual(mockAllAccount);
        expect(prismaSerMock.accounts.findMany).toHaveBeenCalledWith({
            where: {},
            include:{ transactions: true, destination_transactions: true }
        });
    });

    test('getAll user with filter', async () => {
        mockPrismaService.accounts.findMany.mockResolvedValue(
            mockAllAccount.filter(account => account.account_name === 'Jane')
        );

        const result = await repository.getAll({ account_name: 'Jane' });
        expect(result).toEqual([mockAllAccount[0]]);
        expect(prismaSerMock.accounts.findMany).toHaveBeenCalledWith({
            where: { OR: [{ account_name: 'Jane' }]},
            include:{ transactions: true, destination_transactions: true }
        });
    });

    test('getAll user with filter undefined', async () => {
        mockPrismaService.accounts.findMany.mockResolvedValue(
            mockAllAccount.filter(account => account.account_name === 'Ultramilk Taiga')
        );

        const result = await repository.getAll({ account_name: 'Ultramilk Taiga' });
        expect(result).toEqual(undefined);
        expect(prismaSerMock.accounts.findMany).toHaveBeenCalledWith({
            where: { OR: [{ account_name: 'Ultramilk Taiga' }]},
            include:{ transactions: true, destination_transactions: true }
        });
    });

    test('getOne', async () => {
        mockPrismaService.accounts.findUnique.mockResolvedValue(
            mockAllAccount.find(account => account.id === 1)
        );

        const result = await repository.getOne(1);
        expect(result).toEqual(mockAllAccount[0]);
        expect(prismaSerMock.accounts.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include:{ transactions: true, destination_transactions: true }
        });
    });

    test('getOne undefined', async () => {
        mockPrismaService.accounts.findUnique.mockResolvedValue(
            mockAllAccount.find(account => account.id === 5)
        );

        const result = await repository.getOne(1);
        expect(result).toEqual(undefined);
        expect(mockPrismaService.accounts.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include:{ transactions: true, destination_transactions: true }
        });
    });

    test('findAccountNumber', async () => {
        mockPrismaService.accounts.findUnique.mockResolvedValue(
            mockAllAccount.find(account => account.account_number === '4121')
        );

        const result = await repository.findAccountNumber('4121');
        expect(result).toEqual(mockAllAccount[0]);
        expect(prismaSerMock.accounts.findUnique).toHaveBeenCalledWith({
            where: { account_number: '4121' }
        });
    });

    test('findAccountNumber undefined', async () => {
        mockPrismaService.accounts.findUnique.mockResolvedValue(
            mockAllAccount.find(account => account.account_number === '888')
        );

        const result = await repository.findAccountNumber('888');
        expect(result).toEqual(undefined);
        expect(prismaSerMock.accounts.findUnique).toHaveBeenCalledWith({
            where: { account_number: '888' }
        });
    });
    
    test('created', async () => {
        const createAccount = {
            account_number: "8431",
            user_id: 2,
            account_type: AccountType.SAVING,
            account_name: "John Doe",
            balance: new Decimal (40450000),
            currency: "IDR",
            pin: '123456',
            status: AccountStatus.ACTIVE,
            branch_code: "JKT002",
        }
        mockPrismaService.accounts.create.mockResolvedValue(mockAllAccount[1]);

        const result = await repository.created(createAccount);
        expect(result).toEqual(mockAllAccount[1]);
        expect(prismaSerMock.accounts.create).toHaveBeenCalledWith({
            data: {
                user_id: createAccount.user_id,
                account_number: createAccount.account_number,
                account_type: createAccount.account_type,
                account_name: createAccount.account_name,
                balance: createAccount.balance,
                currency: createAccount.currency,
                status: createAccount.status,
                pin: createAccount.pin,
                branch_code: createAccount.branch_code,
            }
        });
    });

    test('updated', async () => {
        const updateAccount: Update = {
            id: 2,
            account: expect.objectContaining ({ account_name: 'John Doe', })
        }
        mockPrismaService.accounts.update.mockResolvedValue(mockAllAccount[1]);

        const result = await repository.updated(updateAccount);
        expect(result).toEqual(mockAllAccount[1]);
        expect(prismaSerMock.accounts.update).toHaveBeenCalledWith({
            where: {
                id: updateAccount.id
            },
            data: expect.objectContaining ({
                account_name: updateAccount.account.account_name,
            }),
            include: { transactions: true, destination_transactions: true }
        });
    });

    test('deleted', async () => {
        mockPrismaService.accounts.delete.mockResolvedValue(
            mockAllAccount.find(account => account.id === 1)
        );

        const result = await repository.deleted(1);
        expect(result).toEqual(mockAllAccount[0]);
        expect(prismaSerMock.accounts.delete).toHaveBeenCalledWith({
            where: {
                id: 1
            },
        });
    });

});
