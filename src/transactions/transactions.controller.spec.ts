import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsServiceItf } from './transactions.service.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../global/guards/auth.guard';

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
});
