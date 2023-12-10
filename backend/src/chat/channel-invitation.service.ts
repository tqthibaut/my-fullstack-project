// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/user.entity';
// import { Channel } from './channel.entity/channel.entity';

// @Injectable()
// export class ChannelInvitationService {
//   constructor(
//     @InjectRepository(User) private readonly userRepository: Repository<User>,
//     @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
//   ) {}

//   async inviteToChannel(channelId: number, userId: number, inviterId: number): Promise<void> {
//     // Your implementation for inviting to a channel
//   }

//   async acceptChannelInvite(channelId: number, userId: number): Promise<void> {
//     // Your implementation for accepting a channel invitation
//   }

//   async rejectChannelInvite(channelId: number, userId: number): Promise<void> {
// 	// Check for the existence of the invitation
// 	const invitation = await this.notificationService.findUniqueNotification(
// 		userId, 
// 		channelId, 
// 		NotificationType.CHANNEL_INVITE
// 		// status: 'pending' // Uncomment or implement as needed
// 	);

// 	if (!invitation) {
// 		throw new Error('No pending invitation found');
// 	}

// 	// No need to modify the channel members since the invitation is rejected

// 	// Update the notification status to 'rejected'
// 	await this.notificationService.updateNotificationStatus(
// 		invitation.id, 
// 		{ status: NotificationStatus.REJECTED }
// 	);

// 	await this.notificationService.deleteNotification(invitation);
// 	return;
// }
//   }
// }
