import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity/channel.entity';
import { CreateChannelDto } from './create-channel.dto';
import { ChannelDto } from './dto/channels.dto';
import { User } from 'src/users/user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType, NotificationStatus } from 'src/notification/notification-type.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatGateway } from './chat.gateway';
import { ChannelMessageDto } from './dto/channelMessage.dto';
import { Message } from './message.entity/message.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private notificationService: NotificationService,
        private chatGateway: ChatGateway,

    ) {}

    async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
        // Fetch the User entity for the creator
        const creator = await this.userRepository.findOne({ where: { username: createChannelDto.creator } });
    
        if (!creator) {
            throw new Error('Creator not found');
        }
    
        // Create a new channel with the fetched User entity as the creator
        const newChannel = this.channelRepository.create({
            ...createChannelDto,
            creator
        });
    
        return await this.channelRepository.save(newChannel);
    }

    async getChannels(): Promise<Channel[]> {
        return await this.channelRepository.find();
    }

    async getUserChannels(userId: number): Promise<ChannelDto[]> {
        // Fetch the channels that the user is part of
        const channels = await this.channelRepository.find({ 
            where: { members: { userId: userId } } 
        });
        return channels.map(channel => new ChannelDto(channel)); // Convert to DTOs
    }

    async getChannelMembers(channelId: number): Promise<number[]> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['members'],
        });
    
        if (!channel) {
            throw new Error('Channel not found');
        }
    
        return channel.members.map(member => member.userId);
    }

    async updateChannel(id: number, name?: string, isPrivate?: boolean): Promise<Channel> {
        const channel = await this.channelRepository.findOne({ where: {id} });
        if (!channel) {
            throw new Error('Channel not found');
        }
        if (name !== undefined) channel.name = name;
        if (isPrivate !== undefined) channel.isPrivate = isPrivate;
        return await this.channelRepository.save(channel);
    }

    // async autoJoinChannelsOnLogin(userId: number) {
    //     const channels = await this.getUserChannels(userId);
    //     const channelIds = channels.map(channel => channel.channelId);
    //     this.chatGateway.joinChannels(userId, channelIds);
    // }
  

    async inviteToChannel(channelId: number, userId: number, inviterId: number): Promise<void> {
        // Check if the target user exists
        const targetUser = await this.userRepository.findOne({where: {userId: userId}});
        if (!targetUser) {
            throw new Error('Target user does not exist');
        }

        // Check if the channel exists and retrieve its details
        const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ['members'] });
        if (!channel) {
            throw new Error('Channel not found');
        }

        // Check for existing membership and pending invitations
        const isAlreadyMember = channel.members.some(member => member.userId === userId);
        const existingInvitation = await this.notificationService.findUniqueNotification(
            userId,
            channelId,
            NotificationType.CHANNEL_INVITE
            // status: 'pending'
        );

        if (isAlreadyMember || existingInvitation) {
            throw new Error('User is already a member or has a pending invitation');
        }

        // Access control for private channels
        if (channel.isPrivate && channel.creator.userId !== inviterId) {
            throw new Error('Only the channel creator can invite users');
        }

        // Create and send the invitation notification
        await this.notificationService.createAndSendNotification({
            sender: inviterId,
            receiver: userId,
            type: NotificationType.CHANNEL_INVITE,
            message: 'You have been invited to join the channel',
            channelId: channelId
        });
    }

    async acceptChannelInvite(channelId: number, userId: number): Promise<void> {
        // Check for the existence of the invitation
        const invitation = await this.notificationService.findUniqueNotification(userId, channelId,NotificationType.CHANNEL_INVITE
            // status: 'pending'
        );

        if (!invitation) {
            throw new Error('No pending invitation found');
        }

        const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ['members'] });

        if (!channel) {
            throw new Error('Channel not found');
        }

        const newMember = await this.userRepository.findOne({ where: {userId: userId}});
        channel.members.push(newMember); // Or update the status if the user is already in the list

        // Save the updated channel
        await this.channelRepository.save(channel);

        // Update the notification status
        await this.notificationService.updateNotificationStatus(invitation.id, { status: NotificationStatus.ACCEPTED });
    }

    async rejectChannelInvite(channelId: number, userId: number): Promise<void> {
        // Check for the existence of the invitation
        const invitation = await this.notificationService.findUniqueNotification(
            userId, 
            channelId, 
            NotificationType.CHANNEL_INVITE
            // status: 'pending' // Uncomment or implement as needed
        );
    
        if (!invitation) {
            throw new Error('No pending invitation found');
        }
    
        // No need to modify the channel members since the invitation is rejected
    
        // Update the notification status to 'rejected'
        await this.notificationService.updateNotificationStatus(
            invitation.id, 
            { status: NotificationStatus.REJECTED }
        );

        await this.notificationService.deleteNotification(invitation);
        return;
    }

    async   addUserToChannel(channelId: number, userId: number): Promise <User[]> {
        const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ['members'] });
        if (!channel) {
            throw new Error('Channel not found');
        }

        const isMember = channel.members.some(member => member.userId === userId);

        if (!isMember) {
            const userToAdd = await this.userRepository.findOne({ where: { userId: userId } });
            if (!userToAdd) {
                throw new Error('User not found');
            }
            channel.members.push(userToAdd);
        }
    
        await this.channelRepository.save(channel);
        return channel.members;
    }

    async   removeUserFromChannel(channelId: number, userId: number): Promise <User[]> {
        const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ['members'] });
        if (!channel) {
            throw new Error('Channel not found');
        }

        channel.members = channel.members.filter(member => member.userId !== userId);
        await this.channelRepository.save(channel);
        return channel.members;
    }

    async getLastMessages(channelId: number): Promise<Message[]> {
        const channelWithMessages = await this.channelRepository.createQueryBuilder('channel')
          .leftJoinAndSelect('channel.messages', 'message')
          .where('channel.id = :channelId', { channelId })
          .orderBy('message.createdAt', 'DESC')
          .getOne();
    
        if (channelWithMessages && channelWithMessages.messages) {
          // If there are more than 50 messages, slice the array to get the last 50
          return channelWithMessages.messages.slice(0, 50);
        } else {
          // Return an empty array if no messages are found
          return [];
        }
      }

    /* ****************************************************************
        EVEN RELATED METHODS: BECAUSE CIRCULAR DEPENDENCIES ARE A FUCKING PAIN IN THE ASS
        NestJS is the only fucking language when you can't interconnect modules. This is 
        the dumbest shit ever
    ******************************************************************* */

        @OnEvent('channel.join')
        async handleChannelJoin(data: { channelId: number; userId: number; client: any }) {
          const { channelId, userId, client } = data;
      
          const updatedMembers = await this.addUserToChannel(channelId, userId);
      
          const membersPublicInfo = updatedMembers.map(user => ({
            userId: user.userId,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
          }));
      
          this.chatGateway.sendToChannel(channelId, `updateChannelMembers`, membersPublicInfo);
        }

        @OnEvent('channelLeave')
        async handleChannelLeave(channelId: number, userId: number) {
            const updatedMembers = await this.removeUserFromChannel(channelId, userId);
            const membersPublicInfo = updatedMembers.map(user => ({
                userId: user.userId,
                username: user.username,
                profileImageUrl: user.profileImageUrl,
            }));
            this.chatGateway.sendToChannel(channelId, `updateChannelMembers`, membersPublicInfo);
        }
}
