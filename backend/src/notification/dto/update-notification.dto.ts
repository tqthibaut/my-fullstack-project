export enum NotificationStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	READ = 'read',
	UNREAD = 'unread'
  }
  

export class UpdateNotificationDto {
	status: NotificationStatus;
  }
  