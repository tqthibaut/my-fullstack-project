// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUsersService.findOne.mockResolvedValue(null);

    await expect(authService.signIn('unknown', 'password')).rejects.toThrow('User not found');
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    mockUsersService.findOne.mockResolvedValue({ username: 'known', password: 'hashedPassword' });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(authService.signIn('known', 'wrongPassword')).rejects.toThrow('Wrong password');
  });

  it('should return JWT if credentials are correct', async () => {
    const mockUser = { userId: 1, username: 'known', password: 'hashedPassword' };
    mockUsersService.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('mockedJwtToken');

    const result = await authService.signIn('known', 'correctPassword');

    expect(result).toEqual({ access_token: 'mockedJwtToken' });
  });
});
