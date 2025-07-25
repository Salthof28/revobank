import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepositoryItf } from './user.repository.interface';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { EmailRegisteredException } from '../auth/exceptions/email-registered-exception';

describe('UserService', () => {
  let service: UserService;
  let repository: Partial<UserRepositoryItf>;

  let createMockUser: CreateUserDto ;

  let mockAllUsers ;

  const mockUsersRepository = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    findExistingUser: jest.fn(),
    updated: jest.fn(),
  }
  
  beforeEach(async () => {
    createMockUser = {
      name: 'John',
      phone: '7635298576',
      number_ktp: '1234567890123454',
      email: 'john@mail.com',
      password: '8e5e202b046dcfd3.5be6a2c41d643ace3a78ee059d28658acdfce9b492bc6a7a5e15c2109b23a3d1d17bf197ce8f5d157a12c34229bef1974ff7151c99370fd534bac871b34c8a9c',
      role_user: 'CUSTOMER'
    };
    mockAllUsers = [
    {
      id: 1,
      name: 'Bolobolo',
      phone: '1234567890',
      number_ktp: '1234567890123456',
      email: 'bolobolo@mail.com',
      password: 'bolo123',
      role_user: 'CUSTOMER'
    },
    {
      id: 2,
      name: 'John',
      phone: '7635298576',
      number_ktp: '1234567890123454',
      email: 'john@mail.com',
      password: 'john123',
      role_user: 'CUSTOMER'
    }
  ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepositoryItf', useValue: mockUsersRepository}
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    repository = module.get<UserRepositoryItf>('UserRepositoryItf')
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  test('getAllUsers success', async () => {
    mockUsersRepository.getAll.mockResolvedValue(mockAllUsers);

    const result = await service.getAllUsers();
    expect(result).toEqual(mockAllUsers);
    expect(mockUsersRepository.getAll).toHaveBeenCalledWith(undefined);
  });

  test('getAllUsers success with filter', async () => {
    mockUsersRepository.getAll.mockResolvedValue(
      mockAllUsers.filter(users => users.name === 'Bolobolo')
    );

    const result = await service.getAllUsers('Bolobolo');
    expect(result).toEqual([mockAllUsers[0]]);
    expect(mockUsersRepository.getAll).toHaveBeenCalledWith('Bolobolo');
  });

  test('getAllUsers throw exception user not found', async () => {
    mockUsersRepository.getAll.mockResolvedValue(undefined);

    await expect(service.getAllUsers()).rejects.toThrow(UserNotFoundException);
    expect(mockUsersRepository.getAll).toHaveBeenCalledWith(undefined);
  });

  test('adminGetUser success', async () => {
    mockUsersRepository.getOne.mockResolvedValue(
      mockAllUsers.find(user => user.id === 1)
    );

    const result = await service.adminGetUser(1);
    expect(result).toEqual(mockAllUsers[0]);
    expect(mockUsersRepository.getOne).toHaveBeenCalledWith(1);
  });

  test('adminGetUser throw exception user not found', async () => {
    mockUsersRepository.getOne.mockResolvedValue(undefined);

    await expect(service.adminGetUser(1)).rejects.toThrow(UserNotFoundException);
    expect(mockUsersRepository.getOne).toHaveBeenCalledWith(1);
  });

  test('updateUserProfile success', async () => {
    mockUsersRepository.getOne.mockResolvedValue(createMockUser);
    mockUsersRepository.findExistingUser.mockResolvedValue(undefined);
    mockUsersRepository.updated.mockResolvedValue(
      mockAllUsers.find(user => user.id === 2)
    )
    const updateAt = new Date()
    const result = await service.updateUserProfile({
      id: 2,
      body: {
        name: 'John',
        updated_at: updateAt
      }
    });
    expect(result).toEqual(mockAllUsers[1])
    expect(mockUsersRepository.updated).toHaveBeenCalledWith({
      id: 2,
      // partial object
      body: expect.objectContaining ({
        name: 'John',
        updated_at: updateAt
      })
    });
  });

  test('updateUserProfile password success', async () => {
    // await service.
    mockUsersRepository.findExistingUser.mockResolvedValue(undefined);
    mockUsersRepository.getOne.mockResolvedValue(createMockUser);
    mockUsersRepository.updated.mockResolvedValue(
      mockAllUsers.find(user => user.id === 2)
    )

    const updateAt = new Date();
    const newUpdateBody = {
      password: 'john321',
      updated_at: updateAt
    }
    const result = await service.updateUserProfile({
      id: 2,
      body: newUpdateBody,
      oldPassword: 'john123',
    });
    expect(newUpdateBody.password).not.toEqual('john321');
    expect(mockUsersRepository.updated).toHaveBeenCalledWith({
      id: 2,
      body: expect.objectContaining({
        password: newUpdateBody.password,
        updated_at: updateAt
      }) 
    });
  });

  test('updateUserProfile throw exception user not found', async () => {
    // await service.
    mockUsersRepository.getOne.mockResolvedValue(undefined);
    mockUsersRepository.updated.mockResolvedValue(
      mockAllUsers.find(user => user.id === 2)
    )

    const updateAt = new Date();
    const newUpdateBody = {
      password: 'john321',
      updated_at: updateAt
    }
    await expect(service.updateUserProfile({
      id: 2,
      body: newUpdateBody,
      oldPassword: 'john123',
    })).rejects.toThrow(UserNotFoundException);
  });

  test('getProfileUser success', async () => {
    mockUsersRepository.getOne.mockResolvedValue(
      mockAllUsers.find(user => user.id === 1)
    );

    const result = await service.getProfileUser(1);
    expect(result).toEqual(mockAllUsers[0])
    expect(mockUsersRepository.getOne).toHaveBeenCalledWith(1);
  });

  test('getProfileUser throw exception user not found', async () => {
    mockUsersRepository.getOne.mockResolvedValue(undefined);

    await expect(service.adminGetUser(1)).rejects.toThrow(UserNotFoundException);
    expect(mockUsersRepository.getOne).toHaveBeenCalledWith(1);
  });
});
