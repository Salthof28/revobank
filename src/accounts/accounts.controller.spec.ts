import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsServiceItf } from './accounts.service.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../global/guards/auth.guard';
import { RepositoryException } from '../global/exception/exception.repository';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { UpdateAccountDto } from './dto/req/update-account.dto';

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
  const mockCustomError = new RepositoryException('Error Custom');
  const mockDefaultError = new Error('something wrong on our side');

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

  const mockCreate: CreateAccountDto = {
    account_number: "4121",
    user_id: 1,
    account_type: "SAVING",
    account_name: "Jane",
    balance: Decimal(495000000),
    currency: "IDR",
    pin: '123456',
    status: "ACTIVE",
    branch_code: "JKT002",
  }

  const mockUpdate: UpdateAccountDto = {
    account_name: "Jane",
    updated_at: new Date()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: 'AccountsServiceItf', useValue: mockService },
        JwtService
      ]
    }).overrideGuard(AuthGuard).useValue({ canActive: jest.fn(() => true) }).compile();

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

  test('getAllAccounts get data with filter', async () => {
    mockService.getAllAccounts.mockResolvedValue(
      mockAllAccount.filter(accounts => accounts.account_name === 'Jane')
    );

    const result = await controller.getAllAccounts('Jane');
    expect(result).toEqual([mockAllAccount[0]]);
    expect(service.getAllAccounts).toHaveBeenCalledWith({
      account_name: 'Jane',
      account_number: undefined,
      branch_code: undefined
    })
  });

  test('getAllAccounts catch custom error', async () => {
    mockService.getAllAccounts.mockRejectedValue(mockCustomError);

    await expect(controller.getAllAccounts()).rejects.toThrow(RepositoryException);
    expect(service.getAllAccounts).toHaveBeenCalledWith({
      account_name: undefined,
      account_number: undefined,
      branch_code: undefined
    })
  });

  test('getAllAccounts catch default error', async () => {
    mockService.getAllAccounts.mockRejectedValue(mockDefaultError);

    await expect(controller.getAllAccounts()).rejects.toThrow(Error);
    expect(service.getAllAccounts).toHaveBeenCalledWith({
      account_name: undefined,
      account_number: undefined,
      branch_code: undefined
    })
  });

  test('createAccountByAdmin', async () => {
    mockService.createAccount.mockResolvedValue(mockAllAccount[0]);

    const result = await controller.createAccountByAdmin(mockCreate);
    expect(result).toEqual(mockAllAccount[0]);
    expect(service.createAccount).toHaveBeenCalledWith(mockCreate)
  });

  test('createAccountByAdmin catch custom error', async () => {
    mockService.createAccount.mockRejectedValue(mockCustomError);

    await expect(controller.createAccountByAdmin(mockCreate)).rejects.toThrow(RepositoryException);
    expect(service.createAccount).toHaveBeenCalledWith(mockCreate)
  });

  test('createAccountByAdmin catch default error', async () => {
    mockService.createAccount.mockRejectedValue(mockDefaultError);

    await expect(controller.createAccountByAdmin(mockCreate)).rejects.toThrow(Error);
    expect(service.createAccount).toHaveBeenCalledWith(mockCreate)
  });

  test('createAccountByUser', async () => {
    mockService.createAccount.mockResolvedValue(mockAllAccount[0]);

    const mockRequest = { user: { id: 1, name: 'Jane' } }
    const result = await controller.createAccountByUser(mockRequest, mockCreate);
    expect(result).toEqual(mockAllAccount[0]);
    expect(service.createAccount).toHaveBeenCalledWith(mockCreate);
  });

  test('createAccountByUser catch custom error', async () => {
    mockService.createAccount.mockRejectedValue(mockCustomError);

    const mockRequest = { user: { id: 1, name: 'Jane' } }
    await expect(controller.createAccountByUser(mockRequest, mockCreate)).rejects.toThrow(RepositoryException);
    expect(service.createAccount).toHaveBeenCalledWith(mockCreate);
  });

  test('createAccountByUser catch default error', async () => {
    mockService.createAccount.mockRejectedValue(mockDefaultError);

    const mockRequest = { user: { id: 1, name: 'Jane' } }
    await expect(controller.createAccountByUser(mockRequest, mockCreate)).rejects.toThrow(Error);
    expect(service.createAccount).toHaveBeenCalledWith(mockCreate);
  });

  test('getAccount', async () => {
    mockService.getAccount.mockResolvedValue(
      mockAllAccount.find(account => account.id === 1)
    );

    const result = await controller.getAccount(1);
    expect(result).toEqual(mockAllAccount[0]);
    expect(service.getAccount).toHaveBeenCalledWith(1);
  });

  test('getAccount catch custom error', async () => {
    mockService.getAccount.mockRejectedValue(mockCustomError);

    await expect(controller.getAccount(1)).rejects.toThrow(RepositoryException);
    expect(service.getAccount).toHaveBeenCalledWith(1);
  });

  test('getAccount catch default error', async () => {
    mockService.getAccount.mockRejectedValue(mockDefaultError);

    await expect(controller.getAccount(1)).rejects.toThrow(Error);
    expect(service.getAccount).toHaveBeenCalledWith(1);
  });

  test('updateAccount', async () => {
    mockService.updateAccount.mockResolvedValue(mockAllAccount[0]);

    const result = await controller.updateAccount(1, mockUpdate);
    expect(result).toEqual(mockAllAccount[0]);
    expect(service.updateAccount).toHaveBeenCalledWith({
      id: 1,
      account: mockUpdate,
      oldPin: undefined
    });
  });

  test('updateAccount catch custom error', async () => {
    mockService.updateAccount.mockRejectedValue(mockCustomError);

    await expect(controller.updateAccount(1, mockUpdate)).rejects.toThrow(RepositoryException);
    expect(service.updateAccount).toHaveBeenCalledWith({
      id: 1,
      account: mockUpdate,
      oldPin: undefined
    });
  });

  test('updateAccount catch default error', async () => {
    mockService.updateAccount.mockRejectedValue(mockDefaultError);

    await expect(controller.updateAccount(1, mockUpdate)).rejects.toThrow(Error);
    expect(service.updateAccount).toHaveBeenCalledWith({
      id: 1,
      account: mockUpdate,
      oldPin: undefined
    });
  });

  test('updateAccount', async () => {
    mockService.deleteAccount.mockResolvedValue(
      mockAllAccount.find(account => account.id === 1)
    );

    const result = await controller.deleteAccount(1);
    expect(result).toEqual(mockAllAccount[0]);
    expect(service.deleteAccount).toHaveBeenCalledWith(1);
  });

  test('updateAccount catch custom error', async () => {
    mockService.deleteAccount.mockRejectedValue(mockCustomError);

    await expect(controller.deleteAccount(1)).rejects.toThrow(RepositoryException);
    expect(service.deleteAccount).toHaveBeenCalledWith(1);
  });

  test('updateAccount catch default error', async () => {
    mockService.deleteAccount.mockRejectedValue(mockDefaultError);

    await expect(controller.deleteAccount(1)).rejects.toThrow(Error);
    expect(service.deleteAccount).toHaveBeenCalledWith(1);
  });
});
