import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './notification.entity'
import { User } from '../users/user.entity';
import { Channel } from 'src/chat/channel.entity/channel.entity';
import { ChatGatewayModule } from 'src/chat/chat-gateway.module';
import { ChatGateway } from 'src/chat/chat.gateway';
// import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  imports: [
    // ChatGatewayModule,
    TypeOrmModule.forFeature([Notification, User, Channel]),
    ChatGatewayModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
