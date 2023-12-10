import { Controller, Post, Param, Get, Patch, Body } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    // @Post(':targetId/request')
    // sendFriendRequest(@Body('requesterId') requesterId: number, @Param('targetId') targetId: number) {
    //     return this.friendsService.sendFriendRequest(requesterId, targetId);
    // }

    // @Patch(':friendshipId/accept')
    // acceptFriendRequest(@Param('friendshipId') friendshipId: number) {
    //     return this.friendsService.acceptFriendRequest(friendshipId);
    // }

    // @Patch(':friendshipId/reject')
    // rejectFriendRequest(@Param('friendshipId') friendshipId: number) {
    //     return this.friendsService.rejectFriendRequest(friendshipId);
    // }

    @Get()
    listFriends(@Body('userId') userId: number) {
        return this.friendsService.listFriends(userId);
    }

    // Other endpoints as needed, like canceling a friend request, etc.
}
