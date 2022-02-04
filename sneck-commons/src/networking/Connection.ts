import { Clock, Direction, Player } from "..";
import { Game } from "../base/Game";
import { ObjectBag } from "../base/ObjectBag";
import { NetworkClock } from "./NetworkClock";
import { Packets } from "./Packets";

export abstract class Connection {

    readonly clock = new NetworkClock(this);
    game: Game;
    player: Player;

    constructor(
        public readonly isServerSide: boolean
    ) {}

    get isClientSide() { return !this.isServerSide; } 

    onNewGame: (game: Game) => any;
    onNewPlayer: (player: Player) => any;
    onClientEvent: (event: Packets.ClientEvent) => any;

    abstract sendPacket(packet: Packets.Packet): void;

    processIncomingPacket(packet: Packets.Packet) {
        if (packet.type == "clock-info") {
            if (!this.isClientSide) return;

            this.clock.currentTick = packet.tick;
        }
        if (packet.type == "new-game") {
            if (!this.isClientSide) return;

            this.game = new Game(packet.rule);
            this.game.current = packet.selfId;
            if (this.onNewGame) this.onNewGame(this.game);
        }
        if (packet.type == "player-update") {
            if (!this.isClientSide) return;
            
            if (!this.game) return;
            let player = this.game.getPlayer(packet.id);
            if (!player) {
                player = new Player(this.game);
                player.id = packet.id;
                player.bag = new ObjectBag(this.game.rule.boardWidth, this.game.rule.boardHeight);
                this.game.players.push(player);
                if (this.onNewPlayer) this.onNewPlayer(player);
                if (player.id == this.game.current) this.player = player;
            }

            player.name = packet.name;
            player.eliminated = packet.eliminated;
            player.lastInput = packet.lastInput;
            player.holding = packet.hold;
            player.snake.tail = packet.snakeTail;
            player.snake.segments = packet.snakeSegments;
            player.score = packet.score;
            player.objects[0] = packet.objects[0];
            player.objects[1] = packet.objects[1];
            player.objects[2] = packet.objects[2];
            player.bag.objects = packet.eatables;
            player.hasGoOver = packet.hasGoOver;

            if (player.onUpdate) player.onUpdate();
        }
        if (packet.type == "client-move") {
            if (!this.isServerSide) return;

            // Yes player can send multiple moves requests per tick
            // but snake only move in 1 direction per tick
            if (!this.game) return;
            if (!this.player) return;
            this.player.holding = packet.hold;
            
            if (this.player.lastInput == packet.direction) return;
            const isV = (this.player.snake.segments.length % 2) == 1;
            const nextIsV = packet.direction == Direction.UP || packet.direction == Direction.DOWN;
            const currSegDir = this.player.snake.segments[this.player.snake.segments.length - 1] > 0? 1 : -1;
            const nextSegDir = (packet.direction == Direction.DOWN || packet.direction == Direction.RIGHT)? 1 : -1;
            if (isV == nextIsV && currSegDir != nextSegDir) return;

            this.player.lastInput = packet.direction;
        }
        if (packet.type == "client-event") {
            if (!this.isClientSide) return;

            if (this.onClientEvent) this.onClientEvent(packet);
            if (this.player && this.player.onClientEvent) this.player.onClientEvent(packet);
        }
    }

    sendClock(clock: Clock) { this.sendPacket({ type: "clock-info", tick: clock.currentTick }); }
    sendMove(move: Direction, hold: boolean) { this.sendPacket({
        type: "client-move",
        atTick: this.clock.currentTick,
        direction: move,
        hold
    }); }
    setNewGame(game: Game, id: number) {
        this.game = game;
        this.sendPacket({
            type: "new-game",
            rule: game.rule,
            selfId: id
        });
        game.players.forEach(p => this.sendPacket(p.networkPacket()));
    }

}