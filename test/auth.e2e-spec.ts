import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from 'src/api/users/index.entity';
import { clearDatabase } from './typeormTest';
import { UserMock } from './mock/user.mock';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let userToken;
  const authMock = new UserMock();
  const MOCK_USER = authMock.authUser();
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // const MOCK_USER = USER_MOCK;
    app = moduleFixture.createNestApplication();
    await app.init();
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
  it('POST should return 409 if user is already registered with same telephone', () => {
    const TELEPHONE_MOCK_USER = MOCK_USER;
    TELEPHONE_MOCK_USER.email = 'stefan2@test.com';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(TELEPHONE_MOCK_USER)
      .expect(422);
  });

  it('POST should return 404 if firstName is missing', () => {
    const { firstName, ...modifiedUser } = MOCK_USER;
    return request(app.getHttpServer())
      .post('auth/register')
      .send(modifiedUser)
      .expect(404);
  });
  it('POST should return 404 if telephone is missing', () => {
    const { telephone, ...modifiedUser } = MOCK_USER;
    return request(app.getHttpServer())
      .post('auth/register')
      .send(modifiedUser)
      .expect(404);
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
