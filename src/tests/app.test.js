import supertest from 'supertest';
import app from '../app.js';
import { jest } from '@jest/globals'
import { checkDBConnection } from '../db/index.js';
import sequelize from '../db/index.js';
import { postgresContainer } from '../db/index.js';
import { describe } from 'node:test';

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

    describe('POST /api/v1/account/login', () => {
        test('should login successfully and return 200 status', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'loginuser',
                    email: 'loginuser@example.com',
                    password: 'password123'
                });

            // Then, attempt to login
            const response = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'loginuser',
                    password: 'password123'
                });
            expect(response.status).toBe(200);
        });

        test('should return 404 status if account does not exist', async () => {
            const response = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'nonexistentuser',
                    password: 'password123'
                });
            expect(response.status).toBe(404);
        });

        test('should return 400 status if password is incorrect', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'wrongpassworduser',
                    email: 'wrongpassworduser@example.com',
                    password: 'password123'
                });

            // Then, attempt to login with incorrect password
            const response = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'wrongpassworduser',
                    password: 'wrongpassword'
                });
            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/v1/account/logout', () => {
        test('should logout successfully and return 200 status', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'logoutuser',
                    email: 'logoutuser@example.com',
                    password: 'password123'
                });

            // Then, login to get the token
            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'logoutuser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            // Now, attempt to logout
            const response = await supertest(app)
                .post('/api/v1/account/logout')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
        });

        test('should return 401 status if token is missing', async () => {
            const response = await supertest(app)
                .post('/api/v1/account/logout');
            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/v1/account', () => {
        test('should return account details and 200 status', async () => {
            // First, create an account to login with
            const createResponse = await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'getuser',
                    email: 'getuser@example.com',
                    password: 'password123'
                });

            // Then, login to get the token
            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'getuser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            // Now, attempt to get account details
            const response = await supertest(app)
                .get('/api/v1/account')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
        });

        test('should return 401 status if token is missing', async () => {
            const response = await supertest(app)
                .get('/api/v1/account');
            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /api/v1/account/updatePassword', () => {
        test('should update password successfully and return 200 status', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'updatepassworduser',
                    email: 'updatepassworduser@example.com',
                    password: 'password123'
                });

            // Then, login to get the token
            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'updatepassworduser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            // Now, attempt to update password
            const response = await supertest(app)
                .patch('/api/v1/account/updatePassword')
                .set('Cookie', `token=${token}`)
                .send({
                    currentPassword: 'password123',
                    newPassword: 'newpassword123'
                });
            expect(response.status).toBe(200);
        });

        test('should return 401 status if token is missing', async () => {
            const response = await supertest(app)
                .patch('/api/v1/account/updatePassword')
                .send({
                    currentPassword: 'password123',
                    newPassword: 'newpassword123'
                });
            expect(response.status).toBe(401);
        });

        test('should return 400 status if current password is missing or incorrect', async () => {
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'wrongpassworduser',
                    email: 'wrongpassworduser@example.com',
                    password: 'password123'
                });

            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'wrongpassworduser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            const response = await supertest(app)
                .patch('/api/v1/account/updatePassword')
                .set('Cookie', `token=${token}`)
                .send({
                    currentPassword: 'wrongpassword',
                    newPassword: 'newpassword123'
                });
            expect(response.status).toBe(400);
        });

        test('should return 400 status if new password is incorrect or missing', async () => {
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'missingnewpassworduser',
                    email: 'missingnewpassworduser@example.com',
                    password: 'password123'
                });

            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'missingnewpassworduser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            const response = await supertest(app)
                .patch('/api/v1/account/updatePassword')
                .set('Cookie', `token=${token}`)
                .send({
                    currentPassword: 'password123',
                    newPassword: ''
                });
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /api/v1/account/updateEmail', () => {
        test('should update email successfully and return 200 status', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'updateemailuser',
                    email: 'updatemail@example.com',
                    password: 'password123'
                });

            // Then, login to get the token
            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'updateemailuser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            // Now, attempt to update email
            const response = await supertest(app)
                .patch('/api/v1/account/updateEmail')
                .set('Cookie', `token=${token}`)
                .send({
                    email: 'newemail@example.com'
                });
            expect(response.status).toBe(200);
        });

        test('should return 401 status if token is missing', async () => {
            const response = await supertest(app)
                .patch('/api/v1/account/updateEmail')
                .send({
                    email: 'newemail@example.com'
                });
            expect(response.status).toBe(401);
        });

        test('should return 400 status if new email is missing or invalid', async () => {
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'invalidemailuser',
                    email: 'invalidemail@example.com',
                    password: 'password123'
                });

            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'invalidemailuser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            const response = await supertest(app)
                .patch('/api/v1/account/updateEmail')
                .set('Cookie', `token=${token}`)
                .send({
                    email: 'aaas'
                });
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /api/v1/account/updateUsername', () => {
        test('should update username successfully and return 200 status', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'updateusernameuser',
                    email: 'updateusername@example.com',
                    password: 'password123'
                });

            // Then, login to get the token
            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'updateusernameuser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            // Now, attempt to update username
            const response = await supertest(app)
                .patch('/api/v1/account/updateUsername')
                .set('Cookie', `token=${token}`)
                .send({
                    username: 'newusername'
                });
            expect(response.status).toBe(200);
        });

        test('should return 401 status if token is missing', async () => {
            const response = await supertest(app)
                .patch('/api/v1/account/updateUsername')
                .send({
                    username: 'newusername'
                });
            expect(response.status).toBe(401)
        });

        test('should return 400 status if new username is missing or invalid', async () => {
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'ausername',
                    email: 'asueremail@example.com',
                    password: 'password123'
                });

            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'ausername',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            const response = await supertest(app)
                .patch('/api/v1/account/updateUsername')
                .set('Cookie', `token=${token}`)
                .send({
                    username: ''
                });
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/v1/account', () => {
        test('should delete account successfully and return 200 status', async () => {
            // First, create an account to login with
            await supertest(app)
                .post('/api/v1/account/create')
                .send({
                    username: 'deleteuser',
                    email: 'deleteuser@example.com',
                    password: 'password123'
                });

            const loginResponse = await supertest(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'deleteuser',
                    password: 'password123'
                });

            const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

            const response = await supertest(app)
                .delete('/api/v1/account')
                .set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
        });
    });

    test('should return 401 status if token is missing', async () => {
        const response = await supertest(app)
            .delete('/api/v1/account');
        expect(response.status).toBe(401);
    });
});
