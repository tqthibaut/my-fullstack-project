import { Request as ExpressRequest, Response } from 'express';
import { 
	Body, 
	Controller, 
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
	UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RevokeTokenDto } from './revoke-token.dto';
import { Public } from './decorators/public.decorator';
//Please yeet that futur me
// import { ConfigService } from '@nestjs/config';

interface RequestWithUser extends ExpressRequest {
	user: any; 
  }

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	// Login Endpoint, returns only the profile URL, sets up the cookies with HTTP only.
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async signIn(@Body() signInDto: Record<string, any>, @Res() res: any) {
		// console.log('JWT Secret:', this.configService.get('JWT_SECRET'));

		    // Log the entire body received
			console.log('Received signInDto:', signInDto);

			// Extracting specific fields from the body
			const { username, password } = signInDto;
			console.log('Extracted username:', username);
			console.log('Extracted password:', password);  // Be cautious with logging sensitive information like passwords
		
			const { accessToken, refreshToken, profileImgUrl } = await this.authService.signIn(username, password);
		
			// Log the response tokens
			console.log('Generated accessToken:', accessToken);
			console.log('Generated refreshToken:', refreshToken);
		// const { accessToken, refreshToken } = await this.authService.signIn(signInDto.username, signInDto.password);
		
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,  // if your app is running on HTTPS
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
			path: '/auth/refresh-token'
		});

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true, // if your app is running on HTTPS
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
		});
	
		// return res.json({ access_token: accessToken });
		return res.json({ message: "Login successful", profileImgUrl });
	}
	
	// Profile endpoint, uses UserProfileDto (TO DO: UserProfileDto)
	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Req() req: RequestWithUser) {
		return req.user;
	}

	// Refresh Token, TO REDO!!!!
	@Post('/users/refresh-token')
	async refreshToken(@Req() req: any, @Res() res: any) {
		const refreshToken = req.cookies.refreshToken;
	
		try {
			const accessToken = await this.authService.refreshAccessToken(refreshToken);
			return res.json({ access_token: accessToken });
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}
	}

	// Don't know what to do with that, probably in case of error
	@Post('revoke-token')
	async revokeToken(@Body() revokeTokenDto: RevokeTokenDto) {
    	return this.authService.revokeToken(revokeTokenDto.userId);
	}
	
	// I think this one is good
	@Post('logout')
	logout(@Res() res: Response) {
    res.clearCookie('refreshToken', { path: '/auth/refresh-token' });
    return res.json({ message: 'Successfully logged out' });
}


}
