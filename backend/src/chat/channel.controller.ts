import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Patch, Req} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './create-channel.dto'; 
import { ChannelDto } from './dto/channels.dto';
// import { ChatService } from './chat.service';
// import { Message } from './message.entity/message.entity';
import { ChannelMessageDto } from './dto/channelMessage.dto';

@Controller('channels')
export class ChannelController {
    constructor(private channelService: ChannelService,
    ) {}

    @Post()
    createChannel(@Body() createChannelDto: CreateChannelDto) {
        return this.channelService.createChannel(createChannelDto);
    }

    @Put(':id')
    updateChannel(	@Param('id', ParseIntPipe) channelId: number,
					@Body('name') channelName?: string,
					@Body('isPrivate') isPrivate?: boolean) {
        return this.channelService.updateChannel(channelId, channelName, isPrivate);
    }

    @Get()
    getChannels() {
        return this.channelService.getChannels();
    }

    @Post(':channelId/invite/:userId')
    inviteToChannel(@Param('channelId') channelId: number, @Param('userId') userId: number, @Req() req: any) {
        const inviterId = req.user.id; // Assuming you have the user ID in the request
        return this.channelService.inviteToChannel(channelId, userId, inviterId);
    }

    @Patch(':channelId/accept-invite')
    acceptInvite(@Param('channelId') channelId: number, @Req() req: any) {
        const userId = req.user.id; // Assuming you have the user ID in the request
        return this.channelService.acceptChannelInvite(channelId, userId);
    }

    @Get('channels')
    async getUserChannelList(@Req() req: any): Promise<ChannelDto[]> {
        // Assuming req.user.id contains the authenticated user's ID
        return await this.channelService.getUserChannels(req.user.id);
    }

    @Get(':channelId/messages')
    async getLastMessages(@Param('channelId') channelId: number): Promise<ChannelMessageDto[]> {
        const lastMessages = await this.channelService.getLastMessages(channelId);
        return lastMessages.map(lastMessage => new ChannelMessageDto(lastMessage, channelId));
    }

    // @Get('init')
    // async initChatroomForUser(@Req() req: any): Promise<ChannelDto[]> {
    //     console.log("initChatroomForUser @Req is: " + JSON.stringify(req));
    //     const channels = this.channelService.getUserChannels(req.user.id);
    //     this.chatGateway.handleConnection()
    //     // return await this.channelService.getUserChannels(req.user.id);

    // }




    // @Post('channel/:channelId/message')
    // async sendMessage(
    // @Param('channelId') channelId: number,
    // @Body() messageData: { content: string, senderId: number }
    // ): Promise<Message> {
    //     return this.chatService.sendMessage(messageData.content, messageData.senderId, channelId);
    // }

    // @Post('channel/:channelId/join')
    // joinChannel(
    // @Param('channelId') channelId: number,
    // @Body('userId') userId: number
    // ) {
    //     return this.channelService.joinChannel(channelId, userId);
    // }

//     @Get('channel/:channelId/messages')
//     getChannelMessages(@Param('channelId') channelId: number): Promise<Message[]> {
//     return this.chatService.getChannelMessages(channelId);
// }

    // @Post('channel/:channelId/leave')
    // leaveChannel(
    //     @Param('channelId') channelId: number,
    //     @Body('userId') userId: number
    // ) {
    //     return this.channelService.leaveChannel(channelId, userId);
    // }

}
