import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceItf } from './auth.service.interface';
import { CreateUserDto } from '../user/dto/req/create-user.dto';
import { EmailRegisteredException } from './exceptions/email-registered-exception';
import { RepositoryException } from '../global/exception/exception.repository';
import { access } from 'fs';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: AuthServiceItf
  
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn()
  }

  const mockCreateUser: CreateUserDto = {
    name: 'John',
    email: 'john@mail.com',
    password: 'john123',
    phone: '123456789',
    number_ktp: '1234567890123456',
    role_user: 'CUSTOMER',
  }

  const mockLogin: LoginUserDto = {
    email: 'john@mail.com',
    password: 'john123',
  }

  const mockErrorDefault = new Error('something wrong on our side');
  const mockCustomError = new RepositoryException('Error Custom');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'AuthServiceItf', useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authServiceMock = module.get<AuthServiceItf>('AuthServiceItf')
  });

  test('registerUser return user', async () => {
    mockAuthService.register.mockResolvedValue({id: 1, ...mockCreateUser});

    const resultRegister = await controller.registerUser(mockCreateUser);
    expect(resultRegister).toEqual({id: 1, ...mockCreateUser});
    expect(mockAuthService.register).toHaveBeenCalledWith(mockCreateUser);
  });

  test('registerUser catch custom error', async () => {
    mockAuthService.register.mockRejectedValue(mockCustomError);

    await expect(controller.registerUser(mockCreateUser)).rejects.toThrow(RepositoryException);
    expect(mockAuthService.register).toHaveBeenCalledWith(mockCreateUser);
  });

  test('registerUser catch default error', async () => {
    mockAuthService.register.mockRejectedValue(mockErrorDefault);
    await expect(controller.registerUser(mockCreateUser)).rejects.toThrow(Error);
    expect(mockAuthService.register).toHaveBeenCalledWith(mockCreateUser);
  })

  test('login Success', async () => {
    const tokenWalawe = { access_token: 'walawe' }
    mockAuthService.login.mockResolvedValue(tokenWalawe);
    
    const resultLogin = await controller.login(mockLogin);
    expect(resultLogin).toEqual(tokenWalawe);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockLogin);
  });

  test('login catch custom error', async () => {
    mockAuthService.login.mockRejectedValue(mockCustomError);

    await expect(controller.login(mockLogin)).rejects.toThrow(RepositoryException);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockLogin);
  });

  test('login catch default error', async () => {
    mockAuthService.login.mockRejectedValue(mockErrorDefault);

    await expect(controller.login(mockLogin)).rejects.toThrow(Error);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockLogin);
  })

});
