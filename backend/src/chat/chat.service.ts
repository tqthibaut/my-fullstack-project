import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity/message.entity';
import { Channel } from './channel.entity/channel.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		// private chatGateway: ChatGateway,
		) {}

	// Does not really send the message, just saves it in the database
    async sendMessage(content: string, senderId: number, channelId: number): Promise<Message> {
        const message = new Message();
        message.content = content;
        message.senderId = senderId;
        message.channel = await this.channelRepository.findOne({ where: { id: channelId } });
        return await this.messageRepository.save(message);
    }

	async getAllMessages(): Promise<Message[]> {
		return await this.messageRepository.find({ relations: ['sender'] });
	}

	async createChannel(name: string): Promise<Channel> {
		const newChannel = new Channel();
		newChannel.name = name;
		return this.channelRepository.save(newChannel);
	}

	async getChannelMessages(channelId: number): Promise<Message[]> {
		return this.messageRepository.find({
			where: { channel: { id: channelId }  },
			relations: ['sender', 'channel']
		});
	}
}

	//   @SubscribeMessage('sendMessage')
  	// async handleMessage(client: Socket, data: { content: string; senderId: number; channelId: number }) {
    //   // const message = await this.chatService.sendMessage(data.content, data.senderId, data.channelId);
  
    //   this.server.to(`channel_${data.channelId}`).emit('message', {
    //       content: data.content,
    //       senderId: data.senderId,
    //       channelId: data.channelId
    //   });
    //   const savedMessage = await this.chatService.sendMessage(data.content, data.senderId, data.channelId);
  
    //   const members = await this.channelService.getChannelMembers(data.channelId);
      // members.forEach(async (member) => {
      //     if (!this.isOnline(member)) {
      //         // member is offline, create a notification
      //         await this.notificationService.createNotification({
      //             sender: data.senderId,
      //             receiver: member,
      //             type: NotificationType.UNREAD_MESSAGES,
      //             message: data.content,
      //             channelId: data.channelId
      //         });
      //     }
      // });
//   }

	// getMessagesForChannel(channelId)


// }

