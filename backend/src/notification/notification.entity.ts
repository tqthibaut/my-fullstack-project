import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../chat/channel.entity/channel.entity'; // Assuming you have a Channel entity
import { NotificationType } from './notification-type.enum';


@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @ManyToOne(() => Channel, { nullable: true })
  channel: Channel;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  message: string;
}
