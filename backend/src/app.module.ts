import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
// import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity'
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';
import { ChannelModule } from './chat/channel.module';
import { NotificationModule } from './notification/notification.module';
import { FriendsModule } from './friends/friends.module';
import { Friendship } from './friends/friendship.entity';
import { Notification } from './notification/notification.entity';
import { ChatGatewayModule } from './chat/chat-gateway.module';
import { MessagesModule } from './messages/messages.module';
import { Channel } from './chat/channel.entity/channel.entity';
import { Message } from './chat/message.entity/message.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigModule global
      envFilePath: '.env', // Path to your .env file
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Friendship, Notification, Channel, Message],  // You'll add your entities here later
      synchronize: true,  // This will automatically create database tables for your entities
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule, 
    FileModule,
    ChatModule,
    UsersModule, 
    FriendsModule,
    ChannelModule,
    ChatGatewayModule,
    NotificationModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
