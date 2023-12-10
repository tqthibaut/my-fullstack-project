import { Controller, Post, Body, Get, Param} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './message.entity/message.entity';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	
	@Get('messages')
	async getMessages(): Promise<Message[]> {
		return this.chatService.getAllMessages();
	}
}
