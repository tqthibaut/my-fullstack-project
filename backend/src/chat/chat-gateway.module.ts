import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
// import { ChatModule } from './chat.module';
import { AuthModule } from '../auth/auth.module';
// import { NotificationModule } from '../notification/notification.module';
import { ChannelModule } from '../chat/channel.module';
import { JwtService } from '@nestjs/jwt';
// import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [ChatGateway, JwtService],
  exports: [ChatGateway]
})
export class ChatGatewayModule {}
