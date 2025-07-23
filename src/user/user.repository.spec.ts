import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { PrismaService } from "../../prisma/prisma.service";
import { Condition } from "src/global/entities/condition.entity";
import { CreateUserDto } from "./dto/req/create-user.dto";
import { UpdateUserDto } from "./dto/req/update-user.dto";
import { Updated } from "./user.repository.interface";

describe('Testing Auth Repository', () => {
    let userRepoMock: UserRepository;
    let prismaSerMock: PrismaService
    
    const allMockUser = [
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
    // mock prisma
    const mockPrismaService = {
        users: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };
    //
    beforeEach(async () => {
        // mock module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                { provide: PrismaService, useValue: mockPrismaService }
            ],
        }).compile();
        userRepoMock = module.get<UserRepository>(UserRepository);
        prismaSerMock = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAll User', async () => {
        mockPrismaService.users.findMany.mockResolvedValue(allMockUser);

        const allUser = await userRepoMock.getAll();
        expect(allUser).toEqual(allMockUser);
        // test prisma service call correctly
        expect(mockPrismaService.users.findMany).toHaveBeenCalledWith({
            where: { name: undefined },
            include: { accounts: true }
        })
    });

    test('getAll User with filter', async () => {
        mockPrismaService.users.findMany.mockResolvedValue(
            allMockUser.filter(user => user.name === 'John'),
        );

        const allUser = await userRepoMock.getAll('John');
        expect(allUser).toEqual([allMockUser[1]]);
        expect(mockPrismaService.users.findMany).toHaveBeenCalledWith({
            where: { name: 'John' },
            include: { accounts: true }
        })
    });

    test('getAll User, filter not found user', async () => {
        mockPrismaService.users.findMany.mockResolvedValue(undefined);

        const allUser = await userRepoMock.getAll('Jane');
        expect(allUser).toEqual(undefined);
        // test prisma service call correctly
        expect(mockPrismaService.users.findMany).toHaveBeenCalledWith({
            where: { name: 'Jane' },
            include: { accounts: true }
        })
    });

    test('getOne User', async () => {
        mockPrismaService.users.findUnique.mockResolvedValue(
            allMockUser.find(user => user.id === 1),
        );

        const user = await userRepoMock.getOne(1);
        expect(user).toEqual(allMockUser[0]);
        expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { accounts: true }
        })
    });

    test('getOne, not find user', async () => {
        mockPrismaService.users.findUnique.mockResolvedValue(
            allMockUser.find(user => user.id === 4),
        );

        const user = await userRepoMock.getOne(4);
        expect(user).toEqual(undefined);
        expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
            where: { id: 4 },
            include: { accounts: true }
        })
    });

    test('findExistingUser, find first is phone', async () => {
        const condition: Condition[] = [
            { email: 'john@mail.com' },
            { phone: '1234567890' },
            { number_ktp: '1234567890123456' },
        ];
        mockPrismaService.users.findFirst.mockResolvedValue(
            allMockUser.find(user => user.phone === '1234567890')
        );
        const user = await userRepoMock.findExistingUser(condition);
        expect(user).toEqual(allMockUser[0]);
        expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
            where: { OR: condition },
        });
    })

    test('findExistingUser, not find user', async () => {
        const condition: Condition[] = [
            { email: 'jane@mail.com' },
            { phone: '987654321' },
            { number_ktp: '847593424523' },
        ];
        mockPrismaService.users.findFirst.mockResolvedValue(
            allMockUser.find(user => user.phone === '987654321')
        );
        const user = await userRepoMock.findExistingUser(condition);
        expect(user).toEqual(undefined);
        expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
            where: { OR: condition },
        });
    })
    
    test('findEmail', async () => {
        mockPrismaService.users.findUnique.mockResolvedValue(
            allMockUser.find(user => user.email === 'john@mail.com'),
        );

        const user = await userRepoMock.findEmail('john@mail.com');
        expect(user).toEqual(allMockUser[1]);
        expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
            where: { email: 'john@mail.com' }
        })
    })

    test('findEmail, not find user', async () => {
        mockPrismaService.users.findUnique.mockResolvedValue(
            allMockUser.find(user => user.email === 'jane@mail.com'),
        );

        const user = await userRepoMock.findEmail('jane@mail.com');
        expect(user).toEqual(undefined);
        expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
            where: { email: 'jane@mail.com' }
        })
    })

    test('created user', async () => {
        const createUser: CreateUserDto = {
            name: 'John',
            phone: '7635298576',
            number_ktp: '1234567890123454',
            email: 'john@mail.com',
            password: 'john123',
            role_user: 'CUSTOMER'
        };
        mockPrismaService.users.create.mockResolvedValue(allMockUser[1]);
        const resultCreate = await userRepoMock.created(createUser);
        
        expect(resultCreate).toEqual(allMockUser[1]);
        expect(mockPrismaService.users.create).toHaveBeenCalledWith({
            data: {
                name: createUser.name,
                email: createUser.email,
                phone: createUser.phone,
                number_ktp: createUser.number_ktp,
                password: createUser.password,
                role_user: createUser.role_user,
            }
        })
    });

    test('updated user', async () => {
        const updateUser: Updated = {
            id: 2,
            body: { name: 'John Taiga', }
        }
        allMockUser[1] = {
            id: 2,
            name: 'John Taiga',
            phone: '7635298576',
            number_ktp: '1234567890123454',
            email: 'john@mail.com',
            password: 'john123',
            role_user: 'CUSTOMER',
        };
        mockPrismaService.users.update.mockResolvedValue(allMockUser[1]);

        const resultUpdate = await userRepoMock.updated(updateUser);
        expect(resultUpdate).toEqual(allMockUser[1]);
        expect(mockPrismaService.users.update).toHaveBeenCalledWith({
            where: { id: updateUser.id },
            data: {
                name: updateUser.body.name,
                email: updateUser.body.email,
                phone: updateUser.body.phone,
                number_ktp: updateUser.body.number_ktp,
                password: updateUser.body.password,
                role_user: updateUser.body.role_user,
                updated_at: new Date(),
            },
            include: { accounts: true }
        })
    })
})