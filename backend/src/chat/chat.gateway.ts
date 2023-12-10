import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { parse } from 'cookie';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001', // Your frontend URL here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  },
 })
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  constructor(
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    // private chatService: ChatService, 
  ) {}

  private clients = new Map<number, Set<Socket>>();

  isOnline(userId: number): boolean {
    const userConnections = this.clients.get(userId);
    return userConnections && userConnections.size > 0;
  }


  async handleConnection(client: Socket, ...args: any[]) {
    try {
      // const jwtToken = client.handshake.headers.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
      const cookies = client.handshake.headers.cookie;
      if (!cookies) throw new Error('No cookies found');

      const parsedCookies = parse(cookies);
      const jwtToken = parsedCookies['accessToken'];
      if (!jwtToken) throw new Error('No token found');

      // Verify the token
      const decoded = this.jwtService.verify(jwtToken);
      const userId = decoded.sub;

      if (!this.clients.has(userId)) {
        this.clients.set(userId, new Set());
      }

      // Add the client's socket to the set associated with the user ID
      this.clients.get(userId).add(client);

      console.log(`User ${userId} connected`);
    } catch (error) {
      console.error('Authentication error', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (!userId) {
      console.log('Disconnected client did not have a user ID');
      return;
    }

    const connections = this.clients.get(userId);
    if (connections) {
      connections.delete(client);

      if (connections.size === 0) {
        this.clients.delete(userId);
      }
    }

    console.log(`User ${userId} disconnected`);
  }

  private sendNotificationToUser(userId: number, notificationData: any) {
    const client = this.getClientByUserId(userId);
    if (client) {
      client.emit('notification', notificationData);
    }
  }

  private sendToUser(userId: number, emitType:string,  data: any) {
    const client = this.getClientByUserId(userId);
    if (client) {
      client.emit(emitType, data);
    }
  }

  public sendToChannel(channelId: number, emitType: string, data: any) {
    // 'channel_${channelId}' is the room name for the channel
    this.server.to(`channel_${channelId}`).emit(emitType, data);
  }


  // Helper method to get a client by user ID
  private getClientByUserId(userId: number): Socket | undefined {
    const connections = this.clients.get(userId);
    return connections && connections.size > 0 ? connections.values().next().value : undefined;
  }

    async sendNotification(userId: number, notificationData: any) {
    const client = this.getClientByUserId(userId);
    if (client) {
        client.emit('notification', notificationData);
    }
  }

  connectToChannels(userId: number, channelIds: number[]) {
    const client = this.getClientByUserId(userId);
    if (client) {
      channelIds.forEach(channelId => client.join(`channel_${channelId}`));
    }
  }

  // @SubscribeMessage('connectToChannel')
  // connectToChannel(client: Socket, channelId: number) {
  //   const client = this.getClientByUserId(userId);
  // }

  /* ****************************************************************
          EVENT STUFF BECAUSE NESTJS SUCKS BALLS BIG TIME
  **************************************************************** */

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, { channelId, userId }: { channelId: number, userId: number }) {
    client.join(`channel_${channelId}`);
    this.eventEmitter.emit('channel.join', { channelId, userId, client });
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, { channelId, userId } : { channelId: number, userId: number }) {
    
    client.leave('channel_${channelId}');
    this.server.to('channel_${channelId}').emit('userLeft', `User ${client.id} has left the channel.`);
    this.eventEmitter.emit('channelLeave', { userId, channelId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, data: { content: string; senderId: number; channelId: number }) {
    this.server.to(`channel_${data.channelId}`).emit('message', {
      content: data.content,
      senderId: data.senderId,
      channelId: data.channelId
    });
    this.eventEmitter.emit('messageSend', { data });
    // Handle message sending logic here using this.chatService
  }
}
