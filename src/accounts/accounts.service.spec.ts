import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsRepositoryItf } from './accounts.repository.interface';

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: AccountsRepositoryItf;

  const mockRepository = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    findAccountNumber: jest.fn(),
    created: jest.fn(),
    updated: jest.fn(),
    deleted: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: 'AccountsRepositoryItf', useValue: mockRepository }
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    repository = module.get<AccountsRepositoryItf>('AccountsRepositoryItf')
  });

  test('should be defined', async () => {
    mockRepository.getAll.mockResolvedValue(mockAllAccount);

    const result = await service.getAllAccounts()
    expect(result).toEqual(mockAllAccount);
    expect(repository.getAll).toHaveBeenCalledWith(undefined)
  });
});
