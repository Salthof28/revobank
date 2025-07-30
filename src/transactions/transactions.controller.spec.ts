import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsServiceItf } from './transactions.service.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../global/guards/auth.guard';
import { RepositoryException } from '../global/exception/exception.repository';
import { UpdateTransactionDto } from './dto/req/update-transaction.dto';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsServiceItf;

  const mockService = {
    getAllTransaction: jest.fn(),
    getOneTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    transactionTransfer: jest.fn(),
    transactionWithdraw: jest.fn(),
    transactionDeposit: jest.fn()
  };

  const mockCustomError = new RepositoryException('Error Custom');
  const mockDefaultError = new Error('something wrong on our side');

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
    },
    {
      id: 3,
      account_id: 1,
      destination_account_id: null,
      transaction_type: "WITHDRAW",
      status: "COMPLETED",
      amount: Decimal(100000000),
      code_transaction_ref: "WH",
      description: "mock withdraw",
    },
    {
      id: 4,
      account_id: 1,
      destination_account_id: null,
      transaction_type: "DEPOSIT",
      status: "COMPLETED",
      amount: Decimal(100000000),
      code_transaction_ref: "DP",
      description: "mock deposit",
    }
  ];

  const mockTransfer: Partial<CreateTransactionDto> = {
    account_id: 1,
    destination_account_id: 2,
    transaction_type: "TRANSFER",
    status: "COMPLETED",
    amount: Decimal(300000000),
    code_transaction_ref: "TR",
    description: "uang coba kirim",
  }

  const mockWithdraw: Partial<CreateTransactionDto> = {
    account_id: 1,
    transaction_type: "WITHDRAW",
    status: "COMPLETED",
    amount: Decimal(100000000),
    code_transaction_ref: "WH",
    description: "mock withdraw",
  }

  const mockDeposit: Partial<CreateTransactionDto> = {
    account_id: 1,
    transaction_type: "DEPOSIT",
    status: "COMPLETED",
    amount: Decimal(100000000),
    code_transaction_ref: "DP",
    description: "mock deposit",
  }

  const mockUpdate: UpdateTransactionDto = {
    status: "COMPLETED",
    updated_at: new Date()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: 'TransactionsServiceItf', useValue: mockService },
        JwtService
      ],
    }).overrideGuard(AuthGuard).useValue({ canActive: jest.fn(() => true) }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsServiceItf>('TransactionsServiceItf')
  });

  test('getAllTransaction get data', async () => {
    mockService.getAllTransaction.mockResolvedValue(mockAllTransaction);

    const result = await controller.getAllTransaction();
    expect(result).toEqual(mockAllTransaction);
    expect(service.getAllTransaction).toHaveBeenCalledWith({
        transaction_type: undefined,
        status: undefined,
        code_transaction_ref: undefined
    })
  });

  test('getAllTransaction get data with filter', async () => {
    mockService.getAllTransaction.mockResolvedValue(mockAllTransaction);

    const result = await controller.getAllTransaction('TRANSFER');
    expect(result).toEqual(mockAllTransaction);
    expect(service.getAllTransaction).toHaveBeenCalledWith({
        transaction_type: "TRANSFER",
        status: undefined,
        code_transaction_ref: undefined
    })
  });

  test('getAllTransaction catch custom error', async () => {
    mockService.getAllTransaction.mockRejectedValue(mockCustomError);

    await expect(controller.getAllTransaction()).rejects.toThrow(RepositoryException);
    expect(service.getAllTransaction).toHaveBeenCalledWith({
        transaction_type: undefined,
        status: undefined,
        code_transaction_ref: undefined
    })
  });

  test('getAllTransaction catch default error', async () => {
    mockService.getAllTransaction.mockRejectedValue(mockDefaultError);

    await expect(controller.getAllTransaction()).rejects.toThrow(Error);
    expect(service.getAllTransaction).toHaveBeenCalledWith({
        transaction_type: undefined,
        status: undefined,
        code_transaction_ref: undefined
    })
  });

  test('getOneTransaction', async () => {
    mockService.getOneTransaction.mockResolvedValue(
      mockAllTransaction.find(transaction => transaction.id === 1)
    );

    const result = await controller.getOneTransaction(1);
    expect(result).toEqual(mockAllTransaction[0]);
    expect(service.getOneTransaction).toHaveBeenCalledWith(1)
  });

  test('getOneTransaction catch custom error', async () => {
    mockService.getOneTransaction.mockRejectedValue(mockCustomError);

    expect(controller.getOneTransaction(1)).rejects.toThrow(RepositoryException);
    expect(service.getOneTransaction).toHaveBeenCalledWith(1)
  });

  test('getOneTransaction catch default error', async () => {
    mockService.getOneTransaction.mockRejectedValue(mockDefaultError);

    expect(controller.getOneTransaction(1)).rejects.toThrow(Error);
    expect(service.getOneTransaction).toHaveBeenCalledWith(1)
  });

  test('updateTransaction', async () => {
    mockService.updateTransaction.mockResolvedValue(mockAllTransaction[0]);

    const result = await controller.updateTransaction(1, mockUpdate);
    expect(result).toEqual(mockAllTransaction[0]);
    expect(service.updateTransaction).toHaveBeenCalledWith({
      id: 1,
      transaction: mockUpdate
    })
  });

  test('updateTransaction catch custom error', async () => {
    mockService.updateTransaction.mockRejectedValue(mockCustomError);

    expect(controller.updateTransaction(1, mockUpdate)).rejects.toThrow(RepositoryException);
    expect(service.updateTransaction).toHaveBeenCalledWith({
      id: 1,
      transaction: mockUpdate
    })
  });

  test('updateTransaction catch default error', async () => {
    mockService.updateTransaction.mockRejectedValue(mockDefaultError);

    expect(controller.updateTransaction(1, mockUpdate)).rejects.toThrow(Error);
    expect(service.updateTransaction).toHaveBeenCalledWith({
      id: 1,
      transaction: mockUpdate
    })
  });

  test('accountTransfer', async () => {
    mockService.transactionTransfer.mockResolvedValue(mockAllTransaction[0]);

    const result = await controller.accountTransfer({
      ...mockTransfer,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    expect(result).toEqual(mockAllTransaction[0]);
    expect(service.transactionTransfer).toHaveBeenCalledWith({
      body: {
        ...mockTransfer,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountTransfer catch custom error', async () => {
    mockService.transactionTransfer.mockRejectedValue(mockCustomError);

    const result = controller.accountTransfer({
      ...mockTransfer,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    await expect(result).rejects.toThrow(RepositoryException);
    expect(service.transactionTransfer).toHaveBeenCalledWith({
      body: {
        ...mockTransfer,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountTransfer catch default error', async () => {
    mockService.transactionTransfer.mockRejectedValue(mockDefaultError);

    const result = controller.accountTransfer({
      ...mockTransfer,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    await expect(result).rejects.toThrow(Error);
    expect(service.transactionTransfer).toHaveBeenCalledWith({
      body: {
        ...mockTransfer,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountWithdraw', async () => {
    mockService.transactionWithdraw.mockResolvedValue(mockAllTransaction[2]);

    const result = await controller.accountWithdraw({
      ...mockWithdraw,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    expect(result).toEqual(mockAllTransaction[2]);
    expect(service.transactionWithdraw).toHaveBeenCalledWith({
      body: {
        ...mockWithdraw,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountWithdraw catch custom error', async () => {
    mockService.transactionWithdraw.mockRejectedValue(mockCustomError);

    const result = controller.accountWithdraw({
      ...mockWithdraw,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    await expect(result).rejects.toThrow(RepositoryException);
    expect(service.transactionWithdraw).toHaveBeenCalledWith({
      body: {
        ...mockWithdraw,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountWithdraw catch default error', async () => {
    mockService.transactionWithdraw.mockRejectedValue(mockDefaultError);

    const result = controller.accountWithdraw({
      ...mockWithdraw,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    await expect(result).rejects.toThrow(Error);
    expect(service.transactionWithdraw).toHaveBeenCalledWith({
      body: {
        ...mockWithdraw,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountDeposit', async () => {
    mockService.transactionDeposit.mockResolvedValue(mockAllTransaction[3]);

    const result = await controller.accountDeposit({
      ...mockDeposit,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    expect(result).toEqual(mockAllTransaction[3]);
    expect(service.transactionDeposit).toHaveBeenCalledWith({
      body: {
        ...mockDeposit,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountDeposit catch custom error', async () => {
    mockService.transactionDeposit.mockRejectedValue(mockCustomError);

    const result = controller.accountDeposit({
      ...mockDeposit,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    await expect(result).rejects.toThrow(RepositoryException);
    expect(service.transactionDeposit).toHaveBeenCalledWith({
      body: {
        ...mockDeposit,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });

  test('accountDeposit catch default error', async () => {
    mockService.transactionDeposit.mockRejectedValue(mockDefaultError);

    const result = controller.accountDeposit({
      ...mockDeposit,
      pinAccount: "123456"
    } as unknown as CreateTransactionDto & { pinAccount: string });
    await expect(result).rejects.toThrow(Error);
    expect(service.transactionDeposit).toHaveBeenCalledWith({
      body: {
        ...mockDeposit,
        pinAccount: "123456"
      },
      pinAccount: "123456"
    })
  });
});
