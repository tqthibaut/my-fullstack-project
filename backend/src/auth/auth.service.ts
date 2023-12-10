import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Sign in that returns the user access token and refresh token for cookies or local storage. Both can work here.
  async signIn(username: string, plainTextPassword: string): Promise<{ accessToken: string; refreshToken: string, profileImgUrl: string}> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(plainTextPassword, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Wrong password');
    }
    console.log("Generating tokens...");
    const refreshToken = await this.generateRefreshToken(user);
    console.log("Generated refresh token: " + refreshToken);
    const accessToken = this.generateAccessToken(user);
    console.log("Generated access token: " + accessToken);
    const profileImgUrl = user.profileImageUrl;
    return {
      accessToken,
      refreshToken,
      profileImgUrl,
    };
  }

  // This logout works, but I don't know about the endpoint.
  async logout(user: User) {
    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    await this.userRepository.save(user);
  }

  // logout but with update for optimization purposes
  // async logout(userId: number) {
  //   await this.usersRepository.update(userId, {
  //     refreshToken: null,
  //     refreshTokenExpiry: null
  //   });
  // }
  

  // Seems fine too, yeet the tokens from the DB.
  async revokeToken(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({where: {userId: userId}});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    await this.userRepository.save(user);

    return { message: 'Token revoked successfully' };
  }

  // I don't have anything against that one, maybe expiry too long?
  // This one might get the "update" treatment instead of pulling the
  // whole freaking entity.
  private async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = randomBytes(40).toString('hex');

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Set expiry to 7 days from now

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = expiryDate;

    await this.userRepository.save(user);
    return refreshToken;
  }

  // I am not sure I needed an interface for that... but works fine for now.
  // Maybe if User starts becoming too big I might have to use update instead
  // of save.
  private generateAccessToken(user: User): string {
    const payload: JwtPayload = { username: user.username, sub: user.userId };
    // console.log(payload);
    return this.jwtService.sign(payload);
  }

  	async refreshAccessToken(refreshToken: string): Promise<string> {
		const user = await this.userRepository.findOne({where: {refreshToken} });
		
		if (!user) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	
		// Check if the refresh token has expired
		if (user.refreshTokenExpiry < new Date()) {
			throw new UnauthorizedException('Refresh token has expired');
		}
	
		const payload: JwtPayload = { username: user.username, sub: user.userId };
		return await this.jwtService.signAsync(payload);
	}
}