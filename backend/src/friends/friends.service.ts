// friends.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './friendship.entity';
import { User } from '../users/user.entity';
import { PublicUserInfoDto } from '../users/create-pubUserInfo-dto';
// import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/notification-type.enum';
import { UserFriendDto } from 'src/users/dto/user.dto';
import { NotificationService } from 'src/notification/notification.service';
// ... other imports ...

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friendship)
        private friendshipRepository: Repository<Friendship>,
        // private userRepository: Repository<User>,
        // private notificationService: NotificationService,
        // Inject other repositories if needed
    ) {}

    // async sendFriendRequest(requesterId: number, targetId: number): Promise<Friendship> {
    //     // Fetch the requester and target User entities
    //     const requester = await this.userRepository.findOne({ where: { userId: requesterId } });
    //     const target = await this.userRepository.findOne({ where: { userId: targetId } });
    
    //     if (!requester || !target) {
    //         throw new Error('User not found');
    //     }
    
    //     // Check if the friendship already exists
    //     const existingFriendship = await this.friendshipRepository.findOne({
    //         where: { requester, target }
    //     });
    
    //     if (existingFriendship) {
    //         throw new Error('Friendship request already sent or users are already friends');
    //     }
    
    //     // Create and save the new Friendship entity
    //     const friendRequest = this.friendshipRepository.create({
    //         requester,
    //         target,
    //         status: 'pending'
    //     });

    //     await this.notificationService.createAndSendNotification({
    //         sender: requesterId,
    //         receiver: targetId,
    //         type: NotificationType.FRIEND_REQUEST,
    //         message: 'You have a new friend request!',
    //         // Optionally add other fields if needed
    //     });
    
    //     return await this.friendshipRepository.save(friendRequest);
    // }

    // async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
    //     const friendship = await this.friendshipRepository.findOne({where: {id: friendshipId}});
    
    //     if (!friendship || friendship.status !== 'pending') {
    //         throw new Error('Invalid friendship request');
    //     }
    
    //     friendship.status = 'accepted';
    //     return await this.friendshipRepository.save(friendship);
    // }

    // async rejectFriendRequest(friendshipId: number): Promise<Friendship> {
    //     const friendship = await this.friendshipRepository.findOne({where: {id: friendshipId}});

    //     if (!friendship || friendship.status !== 'pending') {
    //         throw new Error('Invalid friendship request');
    //     }

    //     friendship.status = 'rejected';
    //     return await this.friendshipRepository.save(friendship);
    // }

    async listFriends(userId: number): Promise<PublicUserInfoDto[]> {
        // Find all friendships where the user is either the requester or the target
        const friendships = await this.friendshipRepository.find({
            where: [
                { requester: { userId: userId }, status: 'accepted' },
                { target: { userId: userId }, status: 'accepted' }
            ],
            relations: ['requester', 'target']
        });

        // Extract friends from the friendships
        const friends = friendships.map(friendship => {
            const friend = friendship.requester.userId === userId ? friendship.target : friendship.requester;
            return {
                id: friend.userId,
                username: friend.username,
                profileImageUrl: friend.profileImageUrl
            };
        });
    
        return friends;
    }

    // ... other methods ...
}
    
    

    // async sendFriendRequest(requesterId: number, targetId: number): Promise<void> {
    //     // Existing logic to send friend request

    //     // Create and send (or store) a notification
    //     await this.notificationService.createAndSendNotification({
    //         sender: requesterId,
    //         receiver: targetId,
    //         type: NotificationType.FRIEND_REQUEST,
    //         // Additional details as needed
    //     });
    // }

    // Other methods like accept, reject, etc.
