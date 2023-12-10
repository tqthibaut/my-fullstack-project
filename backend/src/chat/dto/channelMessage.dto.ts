import { Message } from "../message.entity/message.entity";
// import { User } from "../../user.entity/user.entity";


export class ChannelMessageDto {
    id: number;

    content: string;

    senderId: number;

    senderName: string;

    channelId: number;

    createdAt: Date;

    constructor(message: Message, channelId: number) {
        this.id = message.id;
        this.content = message.content;
        this.senderId = message.senderId;
        this.senderName = message.sender.username;
        this.channelId = channelId;
        this.createdAt = message.createdAt;
		console.log("ChannelMessageDto created with:" + JSON.stringify(this));
    }
}
