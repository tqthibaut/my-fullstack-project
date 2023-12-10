import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity/channel.entity'; // Import your Channel entity
import { User } from 'src/users/user.entity';
import { NotificationModule } from 'src/notification/notification.module';
// import { NotificationService } from 'src/notification/notification.service';
// import { ChatGateway } from './chat.gateway';
import { ChatGatewayModule } from './chat-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]),
    ChatGatewayModule, 
    NotificationModule,
  ],
  providers: [ChannelService],
  controllers: [ChannelController], 
})
export class ChannelModule {}
