import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification} from './notification.entity';
import { NotificationType } from './notification-type.enum';
import { User } from '../users/user.entity';
import { Channel } from '../chat/channel.entity/channel.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ChatGateway } from 'src/chat/chat.gateway';


@Injectable()
export class NotificationService {
    constructor(
        private chatGateway: ChatGateway,
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,

    ) {}

    async createNotification(notificationData: CreateNotificationDto): Promise<void> {
        const sender = await this.userRepository.findOne({ where: { userId: notificationData.sender } });
        const receiver = await this.userRepository.findOne({ where: { userId: notificationData.receiver } });
        const channel = await this.channelRepository.findOne({ where: { id: notificationData.channelId}});
        const notification = this.notificationRepository.create({
            sender,
            receiver,
            channel, // may be null
            type: notificationData.type,
            message: notificationData.message,
            // status: 'pending',
        });

        await this.notificationRepository.save(notification);

    }

    async createAndSendNotification(notificationData: CreateNotificationDto): Promise<void> {
        // First, check if the receiver is online
        const isReceiverOnline = this.chatGateway.isOnline(notificationData.receiver);
    
        if (isReceiverOnline) {
            // Receiver is online, send the notification via WebSocket
            this.chatGateway.sendNotification(notificationData.receiver, notificationData);
        } else {
            // Receiver is offline, fetch full entities and store the notification
            const sender = await this.userRepository.findOne({ where: { userId: notificationData.sender } });
            const receiver = await this.userRepository.findOne({ where: { userId: notificationData.receiver } });
            let channel = null;
    
            if (notificationData.channelId) {
                channel = await this.channelRepository.findOne({ where: { id: notificationData.channelId } });
            }
    
            const notification = this.notificationRepository.create({
                sender,
                receiver,
                channel, // may be null
                type: notificationData.type,
                message: notificationData.message,
                status: 'pending',
            });
    
            await this.notificationRepository.save(notification);
        }
    }
    
    // async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    //     const notification = this.notificationRepository.create(createNotificationDto);
    //     return await this.notificationRepository.save(notification);
    // }

    async getNotificationsForUser(id: number): Promise<Notification[]> {
        return await this.notificationRepository.find({
            where: { receiver: { userId: id } },
            relations: ['sender', 'receiver', 'channel'], // Adjust based on your needs
        });
    }

    // async findNotification
	async updateNotificationStatus(notificationId: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
		// Retrieve the existing notification
		const notification = await this.notificationRepository.findOne({ where: {id: notificationId }});
		if (!notification) {
		  throw new Error('Notification not found');
		}
	  
		// Update the notification status
		notification.status = updateNotificationDto.status;
	  
		// Save the updated notification
		return await this.notificationRepository.save(notification);
	  }
	  
    // Additional methods as needed ...

    // I got lazy there, needed for channel invites in channel.service
    async findUniqueNotification(targetId: number, channelId: number, type: NotificationType): Promise<Notification | undefined> {
        return await this.notificationRepository.findOne({
            where: {
                receiver: { userId: targetId },
                channel: { id: channelId },
                type,
                status: 'pending'
            },
            relations: ['sender', 'receiver', 'channel'], // Adjust based on your needs
        });
    }

    async findNotificationById(notificationId: number): Promise<Notification | undefined> {
        return await this.notificationRepository.findOne({ where: { id: notificationId } });
    }

    async updateNotificationById(notificationId: number, updateData: UpdateNotificationDto): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
        
        if (!notification) {
            throw new Error('Notification not found');
        }
    
        // Update fields as per updateData
        if (updateData.status) {
            notification.status = updateData.status;
        }
        // Add more fields to update as needed
        return await this.notificationRepository.save(notification);
    }

    async getUnreadNotificationsForUser(userId: number): Promise<Notification[]> {
        return await this.notificationRepository.find({
            where: { receiver: { userId: userId }, status: In(['pending', 'unread']) },
            relations: ['sender', 'receiver', 'channel']
        });
    }

    async deleteNotificationById(notificationId: number): Promise<void> {
        const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
        
        if (!notification) {
            throw new Error('Notification not found');
        }

        await this.notificationRepository.remove(notification);
    }
    
    async deleteNotification(notification: Notification): Promise<void> {
        if (!notification) {
            throw new Error('Notification not provided');
        }

        await this.notificationRepository.remove(notification);
    }
    
    
    
}
