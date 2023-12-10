import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Message } from '../message.entity/message.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: ''})
    description: string;

    @OneToMany(() => Message, message => message.channel)
    messages: Message[];

    @ManyToMany(() => User)
    @JoinTable()
    members: User[];

    @Column({ default: false })
    isPrivate: boolean;

    @ManyToOne(() => User)
    creator: User; // The user who created the channel
}
