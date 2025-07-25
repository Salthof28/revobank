import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserServiceItf } from './user.service.interface';
import { JwtService } from '@nestjs/jwt';
import { RepositoryException } from '../global/exception/exception.repository';
import { Update } from 'src/accounts/accounts.repository.interface';
import { UpdateUserDto } from './dto/req/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userServiceMock: UserServiceItf

  const mockAllUsers = [
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
  


  const mockUserService = {
    getAllUsers: jest.fn(),
    adminGetUser: jest.fn(),
    updateUserProfile: jest.fn(),
    getProfileUser: jest.fn()
  };

  const mockCustomError = new RepositoryException('Error Custom');
  const mockDefaultError = new Error('something wrong on our side');
  const mockRequest = { user: { id: 1 } };
  const mockUpdate = {
    name: 'John',
    oldPassword: 'john123',
    updated_at: new Date()
   }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: 'UserServiceItf', useValue: mockUserService },
        JwtService
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    userServiceMock = module.get<UserServiceItf>('UserServiceItf')
  });

  test('adminGetAllUsers success request', async () => {
    mockUserService.getAllUsers.mockResolvedValue(mockAllUsers);

    const resultGetAllUser = await controller.adminGetAllUsers();
    expect(resultGetAllUser).toEqual(mockAllUsers);
  });

  test('adminGetAllUsers success request with filter', async () => {
    mockUserService.getAllUsers.mockResolvedValue(
      mockAllUsers.filter(user => user.name === 'Bolobolo')
    );

    const resultGetAllUser = await controller.adminGetAllUsers('Bolobolo');
    expect(resultGetAllUser).toEqual([mockAllUsers[0]]);
    expect(mockUserService.getAllUsers).toHaveBeenCalledWith('Bolobolo')
  });

  test('adminGetAllUsers catch custom error', async () => {
    mockUserService.getAllUsers.mockRejectedValue(mockCustomError);

    await expect(controller.adminGetAllUsers()).rejects.toThrow(RepositoryException);
    expect(mockUserService.getAllUsers).toHaveBeenCalledWith(undefined);
  });

  test('adminGetAllUsers catch custom error', async () => {
    mockUserService.getAllUsers.mockRejectedValue(mockDefaultError);

    await expect(controller.adminGetAllUsers()).rejects.toThrow(Error);
    expect(mockUserService.getAllUsers).toHaveBeenCalledWith(undefined);
  });

  test('getProfileUser success request', async () => {
    mockUserService.getProfileUser.mockResolvedValue(
      mockAllUsers.find(user => user.id === 1),
    );

    const result = await controller.getProfileUser(mockRequest);
    expect(result).toEqual(mockAllUsers[0]);
    expect(mockUserService.getProfileUser).toHaveBeenCalledWith(mockRequest.user.id)
  });

  test('getProfileUser catch custom error', async () => {
    mockUserService.getProfileUser.mockRejectedValue(mockCustomError);

    await expect(controller.getProfileUser(mockRequest)).rejects.toThrow(RepositoryException);
    expect(mockUserService.getProfileUser).toHaveBeenCalledWith(mockRequest.user.id)
  });

  test('getProfileUser catch default error', async () => {
    mockUserService.getProfileUser.mockRejectedValue(mockDefaultError);

    await expect(controller.getProfileUser(mockRequest)).rejects.toThrow(Error);
    expect(mockUserService.getProfileUser).toHaveBeenCalledWith(mockRequest.user.id)
  });

  test('updatedUserProfile success request', async () => {
    mockUserService.updateUserProfile.mockResolvedValue(mockAllUsers[1]);

    const result = await controller.updatedUserProfile(mockRequest, mockUpdate);
    expect(result).toEqual(mockAllUsers[1]);
    expect(mockUserService.updateUserProfile).toHaveBeenCalledWith({
      id: mockRequest.user.id,
      body: mockUpdate,
      oldPassword: mockUpdate.oldPassword
    })
  });

  test('updatedUserProfile catch custom error', async () => {
    mockUserService.updateUserProfile.mockRejectedValue(mockCustomError);

    await expect(controller.updatedUserProfile(mockRequest, mockUpdate)).rejects.toThrow(RepositoryException);
    expect(mockUserService.updateUserProfile).toHaveBeenCalledWith({
      id: mockRequest.user.id,
      body: mockUpdate,
      oldPassword: mockUpdate.oldPassword
    })
  });

  test('updatedUserProfile catch custom error', async () => {
    mockUserService.updateUserProfile.mockRejectedValue(mockDefaultError);

    await expect(controller.updatedUserProfile(mockRequest, mockUpdate)).rejects.toThrow(Error);
    expect(mockUserService.updateUserProfile).toHaveBeenCalledWith({
      id: mockRequest.user.id,
      body: mockUpdate,
      oldPassword: mockUpdate.oldPassword
    })
  });

  test('adminGetUser success request', async () => {
    mockUserService.adminGetUser.mockResolvedValue(
      mockAllUsers.find(user => user.id === 1),
    );

    const result = await controller.adminGetUser(1);
    expect(result).toEqual(mockAllUsers[0]);
    expect(mockUserService.adminGetUser).toHaveBeenCalledWith(1)
  });

  test('adminGetUser catch custom error', async () => {
    mockUserService.adminGetUser.mockRejectedValue(mockCustomError);

    await expect(controller.adminGetUser(1)).rejects.toThrow(RepositoryException);
    expect(mockUserService.adminGetUser).toHaveBeenCalledWith(1)
  });

  test('adminGetUser catch default error', async () => {
    mockUserService.adminGetUser.mockRejectedValue(mockDefaultError);

    await expect(controller.adminGetUser(1)).rejects.toThrow(Error);
    expect(mockUserService.adminGetUser).toHaveBeenCalledWith(1)
  });

});
