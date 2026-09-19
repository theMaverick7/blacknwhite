import supertest from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals'
import { checkDBConnection } from '../db/index.js';
import sequelize from '../db/index.js';
import { postgresContainer } from '../db/index.js';

beforeAll(async () => {
    await checkDBConnection(sequelize);
});

afterAll(async () => {
    sequelize.close();
    postgresContainer.stop();
});

describe('Account Routes', () => {
    jest.setTimeout(60000); // Set timeout to 30 seconds for this test suite
    describe('POST /api/v1/account/create', () => {
        describe('Given username, email, and password', () => {

            test('should create a new account and return 201 status', async () => {
                const response = await supertest(app)
                    .post('/api/v1/account/create')
                    .send({
                        username: 'testuser',
                        email: 'testuser@example.com',
                        password: 'password123'
                    });
                expect(response.status).toBe(201);
            });

            test('should return 400 status if username is missing', async () => {
                const response = await supertest(app)
                    .post('/api/v1/account/create')
                    .send({
                        email: 'testuser@example.com',
                        password: 'password123'
                    });
                expect(response.status).toBe(400);
            });

            test('should return 400 status if email is missing', async () => {
                const response = await supertest(app)
                    .post('/api/v1/account/create')
                    .send({
                        username: 'testuser',
                        password: 'password123'
                    });
                expect(response.status).toBe(400);
            });

            test('should return 400 status if password is missing', async () => {
                const response = await supertest(app)
                    .post('/api/v1/account/create')
                    .send({
                        username: 'testuser',
                        email: 'testuser@example.com'
                    });
                expect(response.status).toBe(400);
            });

            test('should return 400 status if username already exists', async () => {
                // First, create an account
                await supertest(app)
                    .post('/api/v1/account/create')
                    .send({
                        username: 'duplicateuser',
                        email: 'duplicateuser@example.com',
                        password: 'password123'
                    });

                // Then, try to create another account with the same username
                const response = await supertest(app)
                    .post('/api/v1/account/create')
                    .send({
                        username: 'duplicateuser',
                        email: 'anotheruser@example.com',
                        password: 'password456'
                    });
                expect(response.status).toBe(400);
            });

        });
    });
});