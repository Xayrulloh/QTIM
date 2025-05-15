import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from '../../database/entities/user.entity';

const mockUserRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: ReturnType<typeof mockUserRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useFactory: mockJwtService },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    service = module.get(AuthService);
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('should register a new user', async () => {
    usersRepo.findOne.mockResolvedValue(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    usersRepo.create.mockImplementation((dto) => dto);
    usersRepo.save.mockImplementation((user) =>
      Promise.resolve({ ...user, id: 1 }),
    );

    const result = await service.register({
      email: 'test@mail.com',
      password: 'pass',
      name: 'Test',
    });
    expect(result.success).toBe(true);
    expect(result.data.accessToken).toBe('mock-token');
  });

  it('should throw if email is already in use', async () => {
    usersRepo.findOne.mockResolvedValue({});
    await expect(
      service.register({
        email: 'exists@mail.com',
        password: 'pass',
        name: 'Name',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should login user with correct credentials', async () => {
    const password = await hash('pass', 10);
    usersRepo.findOne.mockResolvedValue({
      email: 'test@mail.com',
      password,
      id: 1,
      name: 'Test',
    });

    const result = await service.login({
      email: 'test@mail.com',
      password: 'pass',
    });
    expect(result.data.accessToken).toBe('mock-token');
  });
});
