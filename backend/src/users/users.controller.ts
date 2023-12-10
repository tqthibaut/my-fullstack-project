import { Controller, Post, Body, UseInterceptors, UploadedFile, Put, Get, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { LoginDTO } from './login.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDataResponseDto } from './dto/user.dto';
// For some reason I need that
import { Multer } from 'multer';
// import { FileService } from './file.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('register called\n');
    return this.usersService.register(createUserDto);
  }

  @Get('data')
  async getUserData(@Req() req: any): Promise<UserDataResponseDto> {
      return await this.usersService.getUserData(req.user.id);
  }

  @Put('/users/update-profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any) {
    // Here, you would handle the file and body to update the user profile
    // For example, saving the file and updating the user's profile in the database
    return this.usersService.updateUserProfile(file, body);
  }


}