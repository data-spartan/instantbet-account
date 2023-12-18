import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from 'src/api/users/index.entity';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let user;
  let userToken;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // const email = 'stefan@test.com';
    // const password = '1!Aa45678';
    // const firstName = 'stefan';
    // const lastName = 'mili';
    // const telephone = '0642298381';
    // const dateOfBirth = new Date('1993-03-23');

    // user = new User({
    //   email,
    //   password,
    //   firstName,
    //   lastName,
    //   telephone,
    //   dateOfBirth,
    // });
  });

  it('should return 201 if user has registered', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'stefan@test.com',
        password: '1!Aa45678',
        firstName: 'stefan',
        lastName: 'mili',
        telephone: '0642298384',
        dateOfBirth: new Date('1993-03-23'),
      })
      .expect(201);
  });
  it('should return 409 if user is already registered', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'stefan@test.com',
        password: '1!Aa45678',
        firstName: 'stefan',
        lastName: 'mili',
        telephone: '0642298384',
        dateOfBirth: new Date('1993-03-23'),
      })
      .expect(409);
  });

  it('should return 404 if firstName is missing', () => {
    return request(app.getHttpServer())
      .post('auth/register')
      .send({
        email: 'stefan@test.com',
        password: '1!Aa45678',
        lastName: 'mili',
        telephone: '0642298384',
        dateOfBirth: '1993-03-23',
      })
      .expect(404);
  });
  it('should return 404 if telephone is missing', () => {
    return request(app.getHttpServer())
      .post('auth/register')
      .send({
        email: 'stefan@test.com',
        password: '1!Aa45678',
        firstName: 'stefan',
        lastName: 'mili',
        dateOfBirth: '1993-03-23',
      })
      .expect(404);
  });
});

// const res = await request(app.getHttpServer())
//       .get('/users/search')
//       .query({ username: 'peter' });

//     expect(res.statusCode).toEqual(401);
