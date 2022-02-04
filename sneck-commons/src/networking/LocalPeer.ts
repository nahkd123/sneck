import { Connection } from "..";
import { Packets } from "./Packets";

/**
 * Represent local peer connection (with local client and local server).
 * Mainly used for singleplayer games (but can also have local multiplayers
 * game)
 */
export class LocalPeer {

    server: LocalPeerConnection;
    client: LocalPeerConnection;

    constructor() {
        this.server = new LocalPeerConnection(true);
        this.client = new LocalPeerConnection(false);
        this.server.peer = this.client;
        this.client.peer = this.server;
    }
    
}

class LocalPeerConnection extends Connection {

    peer: Connection;

    sendPacket(packet: Packets.Packet): void {
        // debugger;
        this.peer?.processIncomingPacket(packet);
    }
    
}
