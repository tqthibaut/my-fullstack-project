import { NotificationType } from '../notification-type.enum';
// import { User } from '../../users/user.entity';
// import { Channel } from '../../chat/channel.entity/channel.entity';

export class CreateNotificationDto {
  sender: number;
  receiver: number;
  type: NotificationType;
  message?: string;
  channelId?: number;
}
