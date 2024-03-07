import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { clearDatabase } from './typeormTest';
import { UserMock } from './mock/user.mock';
import * as cookieParser from 'cookie-parser';
import { AccountModule } from '@account/account.module';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let cookie;
  let MOCK_USER;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
  });
  beforeEach(async () => {
    const authMock = new UserMock();
    MOCK_USER = authMock.authUser();

    // await app.init();
  });

  it('POST should return 201 if user has registered', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(MOCK_USER)
      .expect(201);
  });
  it('POST should return 409 if user is already registered with same email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(MOCK_USER)
      .expect(409);
  });
  it('POST should return 422 if user is already registered with same telephone', () => {
    MOCK_USER.email = 'stefan2@test.com';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(MOCK_USER)
      .expect(422);
  });

  it('POST should return 400 if firstName is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { firstName, ...modifiedUser } = MOCK_USER;
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(modifiedUser)
      .expect(400);
  });
  it('POST should return 400 if telephone is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { telephone, ...modifiedUser } = MOCK_USER;
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(modifiedUser)
      .expect(400);
  });
  it('POST should return 400 if password format is invalid', () => {
    MOCK_USER.password = '123';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(MOCK_USER)
      .expect(400);
  });
  it('POST should return 200 if login is successfull', async () => {
    const { email, password } = MOCK_USER;
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });
    cookie = res.header['set-cookie'];
    expect(res.statusCode).toBe(200);
  });
  it('POST should return 409 if user with specified email doesnt exist', () => {
    MOCK_USER.email = 'stefan1@test.com';
    const { email, password } = MOCK_USER;

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(404);
  });

  it('POST should return 404 if user exist but password is invalid', () => {
    MOCK_USER.password = '1!Aa4567810';
    const { email, password } = MOCK_USER;

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(404);
  });
  it('POST should return 200 user is signed-out', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Cookie', cookie)
      .expect(200);
  });

  afterAll(async () => {
    await clearDatabase(app);
    await app.close();
  });
});

// const res = await request(app.getHttpServer())
//       .get('/users/search')
//       .query({ username: 'peter' });

//     expect(res.statusCode).toEqual(401);
