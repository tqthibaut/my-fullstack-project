import { Channel } from '../channel.entity/channel.entity';

export class ChannelDto {
	channelId: number;
	channelName: string;
	description: string;

	constructor(channel?: Channel)
	{
		this.channelId = channel.id;
		this.channelName = channel.name;
		this.description = channel.description;
	}
}