import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FileService } from 'src/file/file.service';
import { FriendsService } from 'src/friends/friends.service';
import { ChannelService } from 'src/chat/channel.service';
import { Channel } from '../chat/channel.entity/channel.entity';
import { Friendship } from 'src/friends/friendship.entity';
import { FriendsModule } from 'src/friends/friends.module';
import { ChannelModule } from 'src/chat/channel.module';
import { Notification } from 'src/notification/notification.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ChatGatewayModule } from 'src/chat/chat-gateway.module';
import { FileModule } from 'src/file/file.module';


@Module({
  // create and provide a repository for User entities
  imports: [TypeOrmModule.forFeature([User, Friendship, Channel, Notification]), 
    // FriendsModule,
    // ChannelModule,
    // NotificationModule,
    // ChatGatewayModule,
    FileModule,
    forwardRef(() =>FriendsModule),
    forwardRef(() => ChannelModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => ChatGatewayModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // if you're exporting it
})
export class UsersModule {}