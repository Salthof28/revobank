import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Condition } from 'src/global/entities/condition.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryItf } from 'src/user/user.repository.interface';
import { CreateUserDto } from 'src/user/dto/req/create-user.dto';
import { EmailRegisteredException } from './exceptions/email-registered-exception';
import { PhoneRegisteredException } from './exceptions/phone-registered-exception';
import { InvalidLoginException } from './exceptions/invalid-login-exception';
import { access } from 'fs';

describe('AuthService', () => {
  let authSerMock: AuthService;
  let userRepoMock: Partial<UserRepositoryItf>;

  let createMockUser: CreateUserDto ;
  
  const mockUser = {
    id: 1,
    name: 'John',
    phone: '7635298576',
    number_ktp: '1234567890123454',
    email: 'john@mail.com',
    password: 'john123',
    role_user: 'CUSTOMER',

  };

  const mockUsersRepository = {
    findExistingUser: jest.fn(),
    // findEmail: jest.fn(),
    findEmail: jest.fn(),
    created: jest.fn()
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockedToken'),
  }
  
  beforeEach(async () => {
    createMockUser = {
      name: 'John',
      phone: '7635298576',
      number_ktp: '1234567890123454',
      email: 'john@mail.com',
      password: 'john123',
      role_user: 'CUSTOMER'
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'UserRepositoryItf', useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile();
    authSerMock = module.get<AuthService>(AuthService);
    userRepoMock = module.get<UserRepositoryItf>('UserRepositoryItf');
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  test('Test register (EmailRegisteredException)', async () => {
    mockUsersRepository.findExistingUser.mockResolvedValue({
      ...mockUser, email: createMockUser.email
    })
    
    await expect(authSerMock.register(createMockUser)).rejects.toThrow(EmailRegisteredException);

    expect(mockUsersRepository.findExistingUser).toHaveBeenCalledWith([
      {email: createMockUser.email},
      {phone: createMockUser.phone},
      {number_ktp: createMockUser.number_ktp},
    ]);
    expect(mockUsersRepository.created).not.toHaveBeenCalled();
  });

  test('Test register (PhoneRegisteredException)', async () => {
    mockUsersRepository.findExistingUser.mockResolvedValue({
      ...mockUser, email: createMockUser.phone
    })
    
    await expect(authSerMock.register(createMockUser)).rejects.toThrow(PhoneRegisteredException);

    expect(mockUsersRepository.findExistingUser).toHaveBeenCalledWith([
      {email: createMockUser.email},
      {phone: createMockUser.phone},
      {number_ktp: createMockUser.number_ktp},
    ]);
    expect(mockUsersRepository.created).not.toHaveBeenCalled();
  });

  test('register user success', async () => {
    // findexisting not find email, phone, and ktp registered
    mockUsersRepository.findExistingUser.mockResolvedValue(undefined);
    // return created
    mockUsersRepository.created.mockResolvedValue(mockUser);

    const result = await authSerMock.register(createMockUser);
    expect(result).toEqual(mockUser);
    expect(mockUsersRepository.findExistingUser).toHaveBeenCalledWith([
      {email: createMockUser.email},
      {phone: createMockUser.phone},
      {number_ktp: createMockUser.number_ktp},
    ]);
    expect(mockUsersRepository.created).toHaveBeenCalledWith(createMockUser);
    expect(createMockUser.password).not.toEqual('john123');
    const [salt, hash] = createMockUser.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined()
    // console.log(createMockUser.password);
  });

  test('login succes', async () => {
    await authSerMock.register(createMockUser);
    // mockcoba.password = createMockUser.password;
    mockUsersRepository.findEmail.mockResolvedValue(createMockUser);
    console.log(createMockUser);
    const login = {
      email: 'john@mail.com',
      password: 'john123',
    }
    const result = await authSerMock.login(login);
    expect(result).toEqual({ access_token: 'mockedToken' })
  })

  test('login fail if invalid password', async () => {
    mockUsersRepository.findEmail.mockResolvedValue(mockUser);

    await expect(authSerMock.login(mockUser)).rejects.toThrow(InvalidLoginException);
    expect(mockUsersRepository.findEmail).toHaveBeenCalledWith(mockUser.email);
  });

  
});
