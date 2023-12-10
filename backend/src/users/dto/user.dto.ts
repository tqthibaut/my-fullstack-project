import { Channel } from '../../chat/channel.entity/channel.entity'
import { Notification } from 'src/notification/notification.entity';
import { NotificationType } from 'src/notification/notification-type.enum';
import { User } from '../user.entity';


export class UserChannelDto {
	channelId: number;
	channelName: string;
	description: string;
	// activeUserCount: number;
  
	// Constructor or methods if needed
	// constructor(channel: Channel) {
	// 	this.channelId = channel.id;
	// 	this.channelName = channel.name;
	// 	this.description = channel.description;
	// 	// this.activeUserCount = channel.activeUserCount;
	// }

	constructor(channel: any) {
		this.channelId = channel.id;
		this.channelName = channel.name;
		this.description = channel.description;
	}
  }
  

export class UserFriendDto {
	id: number;
	username: string;
	profileImageUrl: string;
	onlineStatus: boolean; // or a string if you have more statuses like 'offline', 'away', etc.

// Constructor or methods if needed
}

export class UserNotificationDto {
	notificationId: number;
	notificationType: string; // e.g., 'message', 'friendRequest'
	sourceUserId: number; // or 'sourceUsername' depending on how you want to reference it
	// description: string;

	constructor(notification: Notification) {
		this.notificationId = notification.id,
		this.notificationType = NotificationType[notification.type];;
		this.sourceUserId = notification.sender.userId;
		// this.description = notification.description
	}
// Constructor or methods if needed
}

export class UserDto {
    userId: number;
    username: string;
    profileImageUrl: string;
    nickname: string;

    constructor(user: User) {
        this.userId = user.userId;
        this.username = user.username;
        this.profileImageUrl = user.profileImageUrl;
        this.nickname = user.nickname;
    }
}


export class UserDataResponseDto {
	user: UserDto; // Assuming you have a User DTO
	friends: UserFriendDto[];
	channels: UserChannelDto[];
	notifications: UserNotificationDto[];

// Constructor or methods if needed
}
  