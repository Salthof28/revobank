import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsServiceItf } from './accounts.service.interface';
import { JwtService } from '@nestjs/jwt';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsServiceItf;

  const mockService = {
    getAllAccounts: jest.fn(),
    getAccount: jest.fn(),
    createAccount: jest.fn(),
    updateAccount: jest.fn(),
    deleteAccount: jest.fn()
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: 'AccountsServiceItf', useValue: mockService },
        JwtService
      ]
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service= module.get<AccountsServiceItf>('AccountsServiceItf')
  });

  test('getAllAccounts get data', async () => {
    mockService.getAllAccounts.mockResolvedValue(mockAllAccount);

    const result = await controller.getAllAccounts();
    expect(result).toEqual(mockAllAccount);
    expect(service.getAllAccounts).toHaveBeenCalledWith({
      account_name: undefined,
      account_number: undefined,
      branch_code: undefined
    })
  });
});
