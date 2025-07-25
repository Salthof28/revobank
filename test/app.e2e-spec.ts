import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: any;

  // mock token
  let mockTokenAdmin: string;
  let mockTokenCustomer: string;

  // mock for register
  const mockRegisUser = {
    name: 'meUser',
    email: 'user@mail.com',
    password: 'user123',
    phone: '0822222222',
    number_ktp: '2222222222222222',
    role_user: 'CUSTOMER',
  };

  // mock for login
  const loginAdmin = {
    email: 'jane@mail.com',
    password: 'jane123',
  };
  const loginCustomer = {
    email: 'taiga@mail.com',
    password: 'taiga123',
  };
  // mock for create account
  const mockRegisAccount = {
    account_name: "mockingAccount",
    account_number: "3333",
    account_type: "SAVING",
    balance: 10000000,
    currency: "IDR",
    status: "ACTIVE",
    pin: "123456",
    branch_code: "JKT002"
}
  // beforeEach
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    server = app.getHttpServer();
    
    // login admin and get token
    const resLoginAdmin = await request(server).post('/auth/login').send(loginAdmin);
    mockTokenAdmin = resLoginAdmin.body.access_token;
    // login customer and get token
    const resLoginCustomer = await request(server).post('/auth/login').send(loginCustomer);
    mockTokenCustomer = resLoginCustomer.body.access_token;

  });

  afterAll(async () => {
    await app.close()
  })

  // test('POST /auth/register success', async () => {
  //   await request(server).post('/auth/register').send(mockRegisUser).expect(201);
  // })

  describe('test Admin-only route', () => {
    // test get /user
    test('Get /user success', async () => {
      await request(server).get('/user').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    })
    test('Get /user deny because use customer role', async () => {
      await request(server).get('/user').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(403);
    });
    // test get /user/:id
    test('Get /user success', async () => {
      await request(server).get('/user/1').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    });
    test('Get /user deny because use customer role', async () => {
      await request(server).get('/user/1').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(403);
    });
    // test GET /accounts
    test('Get /accounts success', async () => {
      await request(server).get('/accounts').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    });
    test('Get /accounts deny because use customer role', async () => {
      await request(server).get('/accounts').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(403);
    });
    // test POST /accounts
    // test('POST /accounts success', async () => {
    //   await request(server).post('/accounts').set('Authorization', `Bearer ${mockTokenAdmin}`).send(mockRegisAccount).expect(201);
    // });
    test('POST /accounts deny because use customer role', async () => {
      await request(server).post('/accounts').set('Authorization', `Bearer ${mockTokenCustomer}`).send(mockRegisAccount).expect(403);
    });
    // test PATCH /accounts/:id 
    test('PATCH /accounts/:id success', async () => {
      await request(server).patch('/accounts/2').set('Authorization', `Bearer ${mockTokenAdmin}`).send({ account_name: 'salthof' }).expect(200);
    });
    test('PATCH /accounts/:id deny because use customer role', async () => {
      await request(server).patch('/accounts/2').set('Authorization', `Bearer ${mockTokenCustomer}`).send({ account_name: 'salthof' }).expect(403);
    });
    // test GET /transactions
    test('GET /transactions success', async () => {
      await request(server).get('/transactions').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    });
    test('GET /transactions deny because use customer role', async () => {
      await request(server).get('/transactions').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(403);
    });
  });

  describe('test route for need token only', () => {
    // test get /user/profile
    test('Get /user/profile with admin', async () => {
      await request(server).get('/user/profile').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    });
    test('Get /user/profile with customer', async () => {
      await request(server).get('/user/profile').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(200);
    });
    test('Get /user/profile unauthorize', async () => {
      await request(server).get('/user/profile').expect(401);
    });
    // test patch /user/profile
    test('PATCH /user/profile with admin', async () => {
      await request(server).patch('/user/profile').set('Authorization', `Bearer ${mockTokenAdmin}`).send({ name: 'Jane' }).expect(200);
    });
    test('PATCH /user/profile customer', async () => {
      await request(server).patch('/user/profile').set('Authorization', `Bearer ${mockTokenCustomer}`).send({ name: 'Ultramilk Taiga' }).expect(200);
    });
    test('PATCH /user/profile unauthorize', async () => {
      await request(server).patch('/user/profile').send({ name: 'Ultramilk Taiga' }).expect(401);
    });
    // test POST /accounts/register
    // test('POST /accounts/register customer', async () => {
    //   await request(server).post('/accounts/register').set('Authorization', `Bearer ${mockTokenCustomer}`).send(mockRegisAccount).expect(201);
    // });
    // test('POST /accounts/register admin', async () => {
    //   await request(server).post('/accounts/register').set('Authorization', `Bearer ${mockTokenAdmin}`).send(mockRegisAccount).expect(201);
    // });
    test('POST /accounts/register unauthorize', async () => {
      await request(server).post('/accounts/register').send(mockRegisAccount).expect(401);
    });
    // test GET /accounts/:id
    test('GET /accounts/:id with admin', async () => {
      await request(server).get('/accounts/1').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    });
    test('GET /accounts/:id with customer', async () => {
      await request(server).get('/accounts/1').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(200);
    });
    test('GET /accounts/:id with unauthorize', async () => {
      await request(server).get('/accounts/1').expect(401);
    });
    // test DELETE /accounts/:id
    // test('DELETE /accounts/:id with admin', async () => {
    //   await request(server).delete('/accounts/6').set('Authorization', `Bearer ${mockTokenAdmin}`).expect(200);
    // });
    // test('DELETE /accounts/:id with customer', async () => {
    //   await request(server).delete('/accounts/6').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(200);
    // });
    test('DELETE /accounts/:id with unauthorize', async () => {
      await request(server).delete('/accounts/6').expect(401);
    });
    // test GET /transaction/:id
    test('GET /transactions/:id success', async () => {
      await request(server).get('/transactions/1').set('Authorization', `Bearer ${mockTokenCustomer}`).expect(200);
    });
    test('GET /transactions/:id unauthorize', async () => {
      await request(server).get('/transactions/1').expect(401);
    });
  })
  

});
