import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/venting-lounge' })
export class VentingLoungeGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('vent')
  handleVent(@MessageBody() ventData: any, @ConnectedSocket() client: Socket): void {
    console.log('Received vent data:', ventData);
    // Broadcast vent data to all other clients in the venting lounge
    client.broadcast.emit('vent', ventData);
  }
}
