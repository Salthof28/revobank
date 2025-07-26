import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { AccountsRepositoryItf } from '../accounts/accounts.repository.interface';
import { TransactionsRepositoryItf } from './transactions.repository.interface';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repositoryAccount: AccountsRepositoryItf;
  let repositoryTransaction: TransactionsRepositoryItf;

  const mockTransactionRepository = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    createTransactionFail: jest.fn(),
    updateTransaction: jest.fn(),
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn()
  };

  const mockAccountRepository = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    createTransactionFail: jest.fn(),
    updateTransaction: jest.fn(),
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn()
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: 'TransactionsRepositoryItf', useValue: mockTransactionRepository},
        { provide: 'AccountsRepositoryItf', useValue: mockAccountRepository}
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repositoryAccount = module.get<AccountsRepositoryItf>('AccountsRepositoryItf');
    repositoryTransaction = module.get<TransactionsRepositoryItf>('TransactionsRepositoryItf');
  });

  test('getAllTransaction', async () => {
    mockTransactionRepository.getAll.mockResolvedValue(mockAllTransaction);

    const result = await service.getAllTransaction();
    expect(result).toEqual(mockAllTransaction);
    expect(mockTransactionRepository.getAll).toHaveBeenCalledWith(undefined);
  });
});
