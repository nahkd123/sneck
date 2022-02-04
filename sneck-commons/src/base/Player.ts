import { Connection, Direction, Packets, SpeedRule } from "..";
import { Game } from "./Game";
import { Object } from "./Object";
import { ObjectBag } from "./ObjectBag";
import { Snake } from "./Snake";

export class Player {

    id: number;
    name: string;
    eliminated: boolean = false;

    snake: Snake;
    score: number = 0;
    objects: [number, number, number] = [0, 0, 0];
    bag: ObjectBag;
    hasGoOver: boolean = false;

    lastInput: Direction = Direction.UP;
    holding: boolean = false;

    outgoingConnection: Connection;

    ticksCounter: number = 0;

    constructor(public readonly game: Game) {
        this.snake = new Snake();
        this.snake.segments = [-Math.floor(game.height / 4)];
        this.snake.tail = [Math.floor(game.width / 2), Math.floor(game.height / 2) + Math.floor(game.height / 4)];
    }

    /** Called when this player received update request */
    onUpdate: () => any;
    onClientEvent: (event: Packets.ClientEvent) => any;
    onEliminate: () => any;

    /** Perform server update. This will be called once per server tick */
    serverUpdate() {
        if (this.eliminated || !this.game.gameRunning) return;

        const currentSpeed = Math.max(
            this.game.rule.initialSpeed - (
                this.game.rule.speedRule == SpeedRule.LENGTH? Math.floor(this.snake.calculateLength() / 3) :
                this.game.rule.speedRule == SpeedRule.TIME? Math.floor(this.game.gameTicks / 100) : 0
            ), 1
        );
        const ticksPerMove = Math.floor(currentSpeed / (this.holding? 2 : 1));

        if (this.ticksCounter >= ticksPerMove) {
            this.ticksCounter = 0;
            this.snake.move(this.lastInput);
            let headLoc = this.snake.calculateHeadLoc();
            if (headLoc[0] < 0 || headLoc[0] >= this.game.width || headLoc[1] < 0 || headLoc[1] >= this.game.height) {
                this.eliminated = true;
                // TODO: Queue player elimination packets
                return;
            } else if (this.snake.calcuateIntersect(...headLoc)) {
                if (this.hasGoOver) this.hasGoOver = false;
                else {
                    this.eliminated = true;
                    // TODO: Above
                    return;
                }
            }

            let obj: Object;
            if (obj = this.bag.atEatable(...headLoc)) {
                let idx = this.bag.objects.indexOf(obj);
                this.bag.objects.splice(idx, 1);
                this.bag.serverUpdate();

                this.score += obj.type == "apple"? 1 : obj.type == "go-over"? 2 : 3;
                
                if (obj.type == "cut") {
                    this.snake.cutOff(5);
                    this.objects[2]++;
                    // TODO: Send sound play
                } else {
                    if (obj.type == "go-over") {
                        this.hasGoOver = true;
                        this.objects[1]++;
                        // TODO: Send sound play
                    } else this.objects[0]++;

                    // TODO: Fix bug here haha
                    let segmentIdx = this.snake.segments[0] == 0? 1 : 0;
                    let segmentDir = this.snake.segments[segmentIdx] > 0? 1 : -1;
                    this.snake.segments[segmentIdx] += segmentDir;
                    this.snake.tail[segmentIdx == 0? 1 : 0] -= segmentDir;
                }
            }
        }
        
        this.ticksCounter++;

        // this.outgoingConnection?.sendPacket(this.networkPacket());
        // TODO: Broadcast player's update to all players instead
        // We want to keep player's playfield updated every tick, but
        // reduce update speed when broadcasting to others
    }

    networkPacket() {
        return <Packets.PlayerUpdate> {
            type: "player-update",
            id: this.id,
            name: this.name,
            eliminated: this.eliminated,

            lastInput: this.lastInput,
            hold: this.holding,

            snakeSegments: this.snake.segments,
            snakeTail: this.snake.tail,
            score: this.score,
            objects: [...this.objects],

            eatables: this.bag.getEatables(),
            hasGoOver: this.hasGoOver
        };
    }

    consumePacket(packet: Packets.PlayerUpdate) {
        this.id = packet.id;
        this.name = packet.name;
        this.eliminated = packet.eliminated;

        if (!this.snake) this.snake = new Snake();
        this.snake.segments = packet.snakeSegments;
        this.snake.tail[0] = packet.snakeTail[0];
        this.snake.tail[1] = packet.snakeTail[1];
    }

}