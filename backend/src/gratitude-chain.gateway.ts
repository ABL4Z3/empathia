import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface GratitudeNote {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  location?: { lat: number; lng: number };
}

@WebSocketGateway({ namespace: '/gratitude-chain' })
export class GratitudeChainGateway {
  @WebSocketServer()
  server: Server;

  private notes: GratitudeNote[] = [];

  @SubscribeMessage('new-note')
  handleNewNote(@MessageBody() note: GratitudeNote, @ConnectedSocket() client: Socket) {
    this.notes.push(note);
    // Broadcast the new note to all connected clients
    this.server.emit('new-note', note);
  }

  @SubscribeMessage('get-notes')
  handleGetNotes(@ConnectedSocket() client: Socket) {
    client.emit('all-notes', this.notes);
  }
}
