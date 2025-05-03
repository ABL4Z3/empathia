import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  ageGroup: 'young' | 'senior';
  socketId: string;
}

@WebSocketGateway({ namespace: '/generations-connect' })
export class GenerationsConnectGateway {
  @WebSocketServer()
  server: Server;

  private waitingYoung: User[] = [];
  private waitingSenior: User[] = [];
  private pairs: Map<string, string> = new Map(); // socketId to paired socketId

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { id: string; ageGroup: 'young' | 'senior' }, @ConnectedSocket() client: Socket) {
    const user: User = { id: data.id, ageGroup: data.ageGroup, socketId: client.id };
    if (user.ageGroup === 'young') {
      this.waitingYoung.push(user);
    } else {
      this.waitingSenior.push(user);
    }
    this.tryMatch();
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket) {
    this.waitingYoung = this.waitingYoung.filter(u => u.socketId !== client.id);
    this.waitingSenior = this.waitingSenior.filter(u => u.socketId !== client.id);
    const pairedId = this.pairs.get(client.id);
    if (pairedId) {
      this.server.to(pairedId).emit('partner-left');
      this.pairs.delete(pairedId);
      this.pairs.delete(client.id);
    }
  }

  @SubscribeMessage('story')
  handleStory(@MessageBody() data: { message: string }, @ConnectedSocket() client: Socket) {
    const pairedId = this.pairs.get(client.id);
    if (pairedId) {
      this.server.to(pairedId).emit('story', { message: data.message });
    }
  }

  private tryMatch() {
    while (this.waitingYoung.length > 0 && this.waitingSenior.length > 0) {
      const youngUser = this.waitingYoung.shift();
      const seniorUser = this.waitingSenior.shift();
      if (youngUser && seniorUser) {
        this.pairs.set(youngUser.socketId, seniorUser.socketId);
        this.pairs.set(seniorUser.socketId, youngUser.socketId);
        this.server.to(youngUser.socketId).emit('matched', { partnerId: seniorUser.id, partnerAgeGroup: 'senior' });
        this.server.to(seniorUser.socketId).emit('matched', { partnerId: youngUser.id, partnerAgeGroup: 'young' });
      }
    }
  }
}
