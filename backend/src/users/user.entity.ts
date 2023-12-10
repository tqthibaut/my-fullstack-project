import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany , JoinTable} from "typeorm";
import { Message } from '../chat/message.entity/message.entity';
import { Notification } from "src/notification/notification.entity";
import { Friendship } from "../friends/friendship.entity";
import { Channel } from "src/chat/channel.entity/channel.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;
    
	@Column({ nullable: true })
	refreshToken: string;
	
	@Column({ nullable: true })
	refreshTokenExpiry: Date;

    @Column({ nullable: true })
    profileImageUrl: string;  // URL to the profile image
  
    // @Column({ default: '' })
    // firstName: string;
  
    // @Column({ default: '' })
    // lastName: string;

    @OneToMany(() => Friendship, friendship => friendship.requester)
    requestedFriendships: Friendship[];

    @OneToMany(() => Friendship, friendship => friendship.target)
    receivedFriendships: Friendship[];
  
    @Column({ default: '' })
    nickname: string;

    @ManyToMany(() => User)
    @JoinTable()
    friends: User[];

    @OneToMany(() => Notification, notification => notification.receiver)
    notifications: Notification[];

    @ManyToMany(() => Channel)
    @JoinTable() // This is important for the owner side of the relation
    channels: Channel[];

}

	

    // Uncomment if needed in the future.
    // @OneToMany(() => Message, message => message.sender)
    // messages: Message[];
