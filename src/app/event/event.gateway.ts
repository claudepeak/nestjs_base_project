import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from '@nestjs/websockets';
import {Server} from 'socket.io';


import {Logger} from '@nestjs/common';


@WebSocketGateway(parseInt(process.env.WEB_SOCKET_PORT), {
    path: '/',
    serveClient: false,
})
export class EventGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor() {
    }

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('EventGateway');


    listenForMessages() {
        this.server.on('connection', (ws) => {
            ws.on('message', (e) => {
                console.log(e);
            });
        });
        this.logger.log('message received');
    }

    async afterInit() {
        console.log('WebSocket server initialized');
        this.listenForMessages();
    }

    // WebSocket istemcisi 'updateStatus' adlı bir mesaj gönderdiğinde

    handleConnection(client: any): any {
        this.logger.log(`connected... id: ${client.id}`);
        client.id = `id-${Date.now()}`;

        return client.id;
    }

    handleDisconnect(client: any): any {
        this.logger.log(`disconnect... id: ${client.id}`);

    }

}
