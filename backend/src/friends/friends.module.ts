import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Friendship } from './friendship.entity';
// import { User } from '../users/user.entity'
// import { NotificationService } from 'src/notification/notification.service';
// import { NotificationModule } from '../notification/notification.module'; // Import NotificationModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship]), // Register Friendship entity
    // NotificationModule, // Import NotificationModule
    // ... other necessary modules ...
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService], // Export FriendsService if it will be used outside this module
})
export class FriendsModule {}
