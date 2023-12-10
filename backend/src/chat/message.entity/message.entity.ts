import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { Channel } from '../channel.entity/channel.entity';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column({ type: 'text' })
	content: string;
  
	@Column()
	senderId: number;
  
	@ManyToOne(() => User)
	sender: User;
  
	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@ManyToOne(() => Channel, channel => channel.messages)
	channel: Channel;
}