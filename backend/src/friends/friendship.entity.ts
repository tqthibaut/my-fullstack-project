import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.requestedFriendships)
    requester: User;

    @ManyToOne(() => User, user => user.receivedFriendships)
    target: User;

    @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'] })
    status: string;
}