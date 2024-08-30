// src/services/__tests__/authService.test.js

const authRepo = require('../repositories/Auth/authRepo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyEmail = require('../utils/mailTransporter');
const logger = require('../config/logger');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const authService = require('../services/Auth/authServices');

jest.mock('../repositories/Auth/authRepo');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/mailTransporter');
jest.mock('../config/logger');

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('register', () => {
        it('should throw a ConflictError if the email already exists', async () => {
            const data = { email: 'test@example.com', username: 'testuser', password: 'password' };
            authRepo.findEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

            await expect(authService.register(data)).rejects.toThrow(ConflictError);
        });

        it('should create a new account and send a verification email', async () => {
            const data = { email: 'new@example.com', username: 'newuser', password: 'password' };
            authRepo.findEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            authRepo.newAccount.mockResolvedValue({ id: 1, email: 'new@example.com', username: 'newuser' });
            jwt.sign.mockReturnValue('jwtToken');

            const result = await authService.register(data);

            expect(authRepo.findEmail).toHaveBeenCalledWith('new@example.com');
            expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
            expect(authRepo.newAccount).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@example.com', password: 'hashedpassword' }));
            expect(verifyEmail).toHaveBeenCalledWith('newuser', 'jwtToken', 'new@example.com');
            expect(result).toEqual({
                status: 201,
                data: { newAccount: { id: 1, email: 'new@example.com', username: 'newuser' } },
                message: "Account created successfully"
            });
        });

        it('should log an error and throw a generic error on failure', async () => {
            const data = { email: 'error@example.com', username: 'erroruser', password: 'password' };
            const error = new Error('Test error');
            authRepo.findEmail.mockRejectedValue(error);

            await expect(authService.register(data)).rejects.toThrow('server error');
            expect(logger.error).toHaveBeenCalledWith(`Registeration Error at the register service: ${error.message}`);
        });
    });

    describe('login', () => {
        it('should throw a NotFoundError if the email does not exist', async () => {
            const data = { email: 'nonexistent@example.com', password: 'password' };
            authRepo.findEmail.mockResolvedValue(null);

            await expect(authService.login(data)).rejects.toThrow(NotFoundError);
        });

        it('should throw an UnauthorizedError if the password is incorrect', async () => {
            const data = { email: 'test@example.com', password: 'wrongpassword' };
            const foundUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
            authRepo.findEmail.mockResolvedValue(foundUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(data)).rejects.toThrow(UnauthorizedError);
        });

        it('should return an access token if login is successful', async () => {
            const data = { email: 'test@example.com', password: 'correctpassword' };
            const foundUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
            authRepo.findEmail.mockResolvedValue(foundUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('accessToken');

            const result = await authService.login(data);

            expect(result).toEqual({
                status: 200,
                data: { accessToken: 'accessToken' },
                message: "user logged in"
            });
        });

        it('should log an error and throw a generic error on failure', async () => {
            const data = { email: 'error@example.com', password: 'password' };
            const error = new Error('Test error');
            authRepo.findEmail.mockRejectedValue(error);

            await expect(authService.login(data)).rejects.toThrow('server error');
            expect(logger.error).toHaveBeenCalledWith(`Login Error at the login service: ${error.message}`);
        });
    });

    describe('verifyEmail', () => {
        it('should return a success message if email is verified', async () => {
            const data = { id: 1 };
            authRepo.verify.mockResolvedValue({ id: 1, verified: true });

            const result = await authService.verifyEmail(data);

            expect(authRepo.verify).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                status: 200,
                data: { verifyEmail: { id: 1, verified: true } },
                message: "email verified"
            });
        });

        it('should log an error and throw a generic error on failure', async () => {
            const data = { id: 1 };
            const error = new Error('Test error');
            authRepo.verify.mockRejectedValue(error);

            await expect(authService.verifyEmail(data)).rejects.toThrow('server error');
            expect(logger.error).toHaveBeenCalledWith(`verify mail Error at the verify service: ${error.message}`);
        });
    });
});
