// // import { Test, TestingModule } from '@nestjs/testing';
// // import { AuthController } from './auth.controller';
// // import { JwtService } from '@nestjs/jwt'; 


// // describe('AuthController', () => {
// //   let controller: AuthController;

// //   beforeEach(async () => {
// //     // Mock the JwtService
// //     const mockJwtService = {
// //       sign: jest.fn(),
// //       verify: jest.fn(),
// //     }
// //     const module: TestingModule = await Test.createTestingModule({
// //       controllers: [AuthController],
// //       providers: [
// //         {provide: JwtService, useValue: mockJwtService },
// //       ]
// //     }).compile();

// //     controller = module.get<AuthController>(AuthController);
// //   });

// //   it('should be defined', () => {
// //     expect(controller).toBeDefined();
// //   });
// // });


// // import { Test, TestingModule } from '@nestjs/testing';
// // import { AuthController } from './auth.controller';
// // import { AuthService } from './auth.service';

// // describe('AuthController', () => {
// //   let authController: AuthController;
// //   let authService: AuthService;

// //   const mockAuthService = {
// //     signIn: jest.fn(),
// //   };

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       controllers: [AuthController],
// //       providers: [
// //         { provide: AuthService, useValue: mockAuthService },
// //       ],
// //     }).compile();

// //     authController = module.get<AuthController>(AuthController);
// //     authService = module.get<AuthService>(AuthService);
// //   });

// //   it('should be defined', () => {
// //     expect(authController).toBeDefined();
// //   });

// //   describe('signIn', () => {
// //     it('should call authService with correct parameters and return the result', async () => {
// //       const signInData = { username: 'testUser', password: 'testPass' };
// //       const expectedReturn = { access_token: 'mockedJwtToken' };
      
// //       mockAuthService.signIn.mockResolvedValue(expectedReturn);

// //       const result = await authController.signIn(signInData);

// //       expect(authService.signIn).toHaveBeenCalledWith(signInData.username, signInData.password);
// //       expect(result).toEqual(expectedReturn);
// //     });
// //   });

// //   describe('getProfile', () => {
// //     it('should return user from request object', () => {
// //       const mockUser = { id: 1, username: 'testUser' };
// //       const req = { user: mockUser };

// //       const result = authController.getProfile(req);

// //       expect(result).toEqual(mockUser);
// //     });
// //   });
// // });

// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { AuthGuard } from './auth.guard';
// import { UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt'; 


// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;
//   const mockAuthService = {
//     signIn: jest.fn(),
//   };
//   const mockJwtService = {
//     signAsync : jest.fn().mockResolvedValue('mocked token'),
//   }

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         { provide: AuthService, useValue: mockAuthService },
//         { provide: JwtService, useValue: mockJwtService}
//       ],
//     }).overrideGuard(AuthGuard).useValue({ canActivate: jest.fn().mockReturnValue(true) }).compile();

//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   // Reset that fcking mock.
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
  

//   it('should be defined', () => {
//     expect(authController).toBeDefined();
//   });

//   // Test for successful signIn
//   it('should sign in successfully and return JWT', async () => {
//     const jwtToken = 'sample.jwt.token';
//     mockAuthService.signIn.mockResolvedValue({ access_token: jwtToken });

//     const result = await authController.signIn({ username: 'test', password: 'test123' });
//     expect(result.access_token).toBe(jwtToken);
//   });

//   // Error handling: user not found
//   it('should throw UnauthorizedException when user is not found', async () => {
//     mockAuthService.signIn.mockRejectedValue(new UnauthorizedException('User not found'));
//     await expect(authController.signIn({ username: 'unknown', password: 'test123' })).rejects.toThrow(UnauthorizedException);
//   });

//   // Error handling: wrong password
//   it('should throw UnauthorizedException for wrong password', async () => {
//     mockAuthService.signIn.mockRejectedValue(new UnauthorizedException('Wrong password'));
//     await expect(authController.signIn({ username: 'test', password: 'wrongpass' })).rejects.toThrow(UnauthorizedException);
//   });

//   // Input validation is done via Nest's validation pipeline. It'd typically be tested in e2e tests, 
//   // but for the sake of this example, assume a simple check if the body is malformed.
//   it('should handle malformed request body', async () => {
//     // Assuming here that your controller throws a BadRequestException for malformed input.
//     // If it doesn't, this test should be adapted or removed.
//     // This is a simplified example and might not cover the actual validation logic you have in place.
//     await expect(authController.signIn({ user: 'test' })).rejects.toThrowError(); // This will just check for any error.
//   });

//   // Dependency interaction: Ensure signIn is called exactly once.
//   it('should call authService.signIn once', async () => {
//     const jwtToken = 'sample.jwt.token';
//     mockAuthService.signIn.mockResolvedValue({ access_token: jwtToken });
    
//     await authController.signIn({ username: 'test', password: 'test123' });
//     expect(authService.signIn).toHaveBeenCalledTimes(1);
//   });

//   // ... (more tests for other behaviors, such as guards and JWT format)
// });

