import { Injectable, ConflictException , Inject, forwardRef} from '@nestjs/common';
// The 3 next imports are for defining a UserEntity and connecting it to 
//the database
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { FileService } from '../file/file.service';
import { FriendsService } from 'src/friends/friends.service';
import { CreateUserDto } from './create-user.dto';
import { LoginDTO } from './login.dto';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelService } from 'src/chat/channel.service';
import { Notification } from 'src/notification/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { UserFriendDto, UserChannelDto, UserNotificationDto, UserDto, UserDataResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { Friendship } from 'src/friends/friendship.entity';
import { NotificationType } from 'src/notification/notification-type.enum';

@Injectable()
export class UsersService {
  // Removed the hardcoded users and initialized it as an empty array.
  private readonly users = [];

  // Moved the user creation to the constructor using an addUser method. 
  // This method will hash the passwords and add them to the users array.
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    private fileService: FileService, // Inject FileService
    private friendsService: FriendsService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    // private channelService: ChannelService,
    private notificationService: NotificationService,
    // private
  ) {
    // Just populating the db the idiot way, please ignore this
    // this.seedUsers();
  }

  async seedTestUser() {
    const username = process.env.TEST_USER_USERNAME;
    const password = process.env.TEST_USER_PASSWORD;

    let user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = this.usersRepository.create({
        username,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
    }
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    return await this.usersRepository.findOne( {where: {refreshToken} });
  }

  async findById(userId: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { userId: userId }});
  }

  // Modified the createUser method to addUser and used it to add our hardcoded test users.
  async addUser(username: string, plainTextPassword: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    const newUser = this.usersRepository.create({
      username: username,
      password: hashedPassword,
    });
    // It's in the DB now
    // this.users.push(newUser);
    return this.usersRepository.save(newUser);
    
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username }});
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.findOne({
      where: { username: createUserDto.username},});
      // console.log(userExists);
      if (userExists) {
        throw new ConflictException(`Username already exists.`);
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = new User();
      user.username = createUserDto.username;
      user.password = hashedPassword;
      const defaultImages =  await this.fileService.getDefaultProfileImages();
      const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      user.profileImageUrl= randomImage;

      user.profileImageUrl = defaultImages.length > 0
    ? defaultImages[Math.floor(Math.random() * defaultImages.length)]
    : '../../public/profile-images/pngimg.com - beaver_PNG59.png';
      console.log("New User == " + user);
      console.log("New User (stringify): " + JSON.stringify(user));
      return this.usersRepository.save(user);
  }

  async fetchUserFriends(userId: number): Promise<UserFriendDto[]> {
    const friends = await this.friendsService.listFriends(userId);
    return Promise.all(friends.map(async friend => {
      const onlineStatus = this.chatGateway.isOnline(friend.id);
      return {
          ...friend,
          onlineStatus: onlineStatus
      };
    }));
  }

  async fetchUserChannels(userId: number): Promise<UserChannelDto[]> {
    // Fetch the user's channels
    const user = await this.usersRepository.findOne({ 
        where: { userId: userId },
        relations: ['channels'] // Assuming 'channels' is the correct relation name
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user.channels.map(channel => {
        return {
            channelId: channel.id,
            channelName: channel.name,
            description: '', // Add description if available in Channel entity
            activeUserCount: channel.members.length // Number of active users in the channel
            // Any other fields needed from the Channel entity
        };
    });
  }

  async fetchOfflineNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationService.getUnreadNotificationsForUser(userId);
  }


// async login(loginDTO: LoginDTO): Promise<User | null> {
//   const user = await this.findOne(loginDTO.username);
//   console.log("Login called with username: " + loginDTO.username);
  
//   if (!user) {
//       throw new Error('User not found');
//   }

//   const isPasswordMatching = await bcrypt.compare(loginDTO.password, user.password);

//   if (!isPasswordMatching) {
//       throw new Error('Invalid credentials');
//   }

//   return user; 
// }
  async getUserData(userId: number): Promise<UserDataResponseDto> {
    const user = await this.usersRepository.findOne({where: {userId: userId}});
    // console.log("Login called with username: " + loginDTO.username);
    
    if (!user) {
        throw new Error('User not found');
    }
  
    // It is an absolute clusterf*ck, I apologize for the lack of consistency
    // Please futur me do it properly
    // Fetch additional data
    const friends = await this.fetchUserFriends(user.userId); // Implement this method
    const channels = await this.fetchUserChannels(user.userId); // Implement this method
    const notifications = await this.fetchOfflineNotifications(user.userId); // Implement this method
  
    // Convert entities to DTOs
    // That too because of the horrible inconsistencies in the fetch methods
      const friendsDto = friends.map(friend => {
        return {
            id: friend.id,
            username: friend.username,
            profileImageUrl: friend.profileImageUrl,
            // Add other properties as needed
        } as UserFriendDto;
      });
    const channelsDto = channels.map(channel => new UserChannelDto(channel));
    const notificationsDto = notifications.map(notification => new UserNotificationDto(notification));
    const userDto = new UserDto(user);

    return {
      user: userDto,
      friends: friendsDto,
      channels: channelsDto,
      notifications: notificationsDto
    };
    // Create JWT token or similar for the user session
    // const token = this.createTokenForUser(user); // Implement this method
  
    // // Construct the login response
    // const loginResponse = new LoginResponseDto({
    //   user,
    //   token,
    //   friends: friendsDto,
    //   channels: channelsDto,
    //   notifications: notificationsDto
    // });
  
  }


    async sendFriendRequest(requesterId: number, targetId: number): Promise<Friendship> {
        // Fetch the requester and target User entities
        const requester = await this.usersRepository.findOne({ where: { userId: requesterId } });
        const target = await this.usersRepository.findOne({ where: { userId: targetId } });
    
        if (!requester || !target) {
            throw new Error('User not found');
        }
    
        // Check if the friendship already exists
        const existingFriendship = await this.friendshipRepository.findOne({
            where: { requester, target }
        });
    
        if (existingFriendship) {
            throw new Error('Friendship request already sent or users are already friends');
        }
    
        // Create and save the new Friendship entity
        const friendRequest = this.friendshipRepository.create({
            requester,
            target,
            status: 'pending'
        });

        await this.notificationService.createAndSendNotification({
            sender: requesterId,
            receiver: targetId,
            type: NotificationType.FRIEND_REQUEST,
            message: 'You have a new friend request!',
            // Optionally add other fields if needed
        });
    
        return await this.friendshipRepository.save(friendRequest);
    }

    async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
      const friendship = await this.friendshipRepository.findOne({where: {id: friendshipId}});
  
      if (!friendship || friendship.status !== 'pending') {
          throw new Error('Invalid friendship request');
      }
  
      friendship.status = 'accepted';
      return await this.friendshipRepository.save(friendship);
  }

  async rejectFriendRequest(friendshipId: number): Promise<Friendship> {
      const friendship = await this.friendshipRepository.findOne({where: {id: friendshipId}});

      if (!friendship || friendship.status !== 'pending') {
          throw new Error('Invalid friendship request');
      }

      friendship.status = 'rejected';
      return await this.friendshipRepository.save(friendship);
  }

  

  async updateUserProfile(file: Express.Multer.File, body: any): Promise<User> {
    // Save the file to disk
    const savedFilePath = this.saveFile(file);

    const userId = body.userId; // Assuming you're passing the user's ID in the body
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.profileImageUrl = savedFilePath;
    // here update other user details if needed

    return this.usersRepository.save(user);
  }

  private saveFile(file: Express.Multer.File): string {
    const uploadDir = 'uploads';
    const fileName = this.generateFileName(file);
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    return filePath;
  }

  private generateFileName(file: Express.Multer.File): string {
    const fileExtension = path.extname(file.originalname);
    return `${Date.now()}-${file.filename}${fileExtension}`;
  }
}
