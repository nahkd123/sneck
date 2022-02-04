import { Packets, Player } from "..";
import { GameRule } from "./GameRule";

export class Game {

    players: Player[] = [];
    current: number = -1;

    get currentPlayer() { return this.players.find(v => v.id == this.current); }
    get width() { return this.rule.boardWidth; }
    get height() { return this.rule.boardHeight; }

    constructor(public readonly rule: GameRule) {}

    getPlayer(id: number) { return this.players.find(v => v.id == id); }

    countdownTicks = 61;
    gameTicks = 0;
    get gameRunning() { return this.countdownTicks <= 0; }

    serverUpdate() {
        let connections = this.players.map(v => v.outgoingConnection);
        this.players.forEach(p => {
            if (p.eliminated) return;
            p.serverUpdate();
            if (p.eliminated) {
                p.holding = false;
                if (p.onEliminate) p.onEliminate();
                connections.forEach(c => c?.sendPacket(<Packets.Packet> {
                    type: "client-event",
                    event: "eliminate",
                    playerId: p.id
                }));
            }
            connections.forEach(c => c?.sendPacket(p.networkPacket()));
        });

        if (this.countdownTicks > 0) {
            this.countdownTicks--;
            if ((this.countdownTicks % 20) == 0) connections.forEach(c => c?.sendPacket(<Packets.ClientEvent> {
                type: "client-event",
                event: "countdown",
                countdown: Math.floor(this.countdownTicks / 20)
            }));
        } else this.gameTicks++;
    }

    #running = false;

    start() {
        if (this.#running) return;
        this.#running = true;

        let task = setInterval(() => {
            if (!this.#running) {
                clearInterval(task);
                return;
            }

            this.serverUpdate();
        }, 50);
    }

}