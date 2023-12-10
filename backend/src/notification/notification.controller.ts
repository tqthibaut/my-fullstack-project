import { Controller, Get, Param, Patch, Body} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { UpdateNotificationDto } from './dto/update-notification.dto';

// notification.controller.ts
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:userId')
  async getUnreadNotificationsForUser(@Param('userId') userId: number): Promise<Notification[]> {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Patch('/:notificationId')
  async updateNotificationStatus(
	@Param('notificationId') notificationId: number,
	@Body() updateNotificationDto: UpdateNotificationDto
	): Promise<Notification> {
		return this.notificationService.updateNotificationStatus(notificationId, updateNotificationDto);
}

}

