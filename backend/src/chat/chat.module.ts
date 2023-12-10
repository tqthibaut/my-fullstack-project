import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity/message.entity';
import { Channel } from './channel.entity/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}