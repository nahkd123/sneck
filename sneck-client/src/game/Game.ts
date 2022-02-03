import { GameAudio } from "../GameAudio";
import { Direction } from "./Direction";
import { Object } from "./Object";
import { Objective } from "./Objective";
import { Playfield } from "./Playfield";

export class Game {

    primary: Playfield;
    lastDirection: Direction = Direction.UP;
    hold = false;

    running = false;
    over = false;
    initialAutomoveTicks = 10;
    speedupAfterTicks = 20 * 10;
    countdownTicks = 20;

    onTick: () => any;
    onOver: () => any;

    constructor(
        public readonly objective: Objective
    ) {}

    setNext(dir: Direction) {
        if (this.lastDirection == dir) return;

        const isV = (this.primary.snake.segments.length % 2) == 1;
        const nextIsV = dir == Direction.UP || dir == Direction.DOWN;
        const currSegDir = this.primary.snake.segments[this.primary.snake.segments.length - 1] > 0? 1 : -1;
        const nextSegDir = (dir == Direction.DOWN || dir == Direction.RIGHT)? 1 : -1;
        if (isV == nextIsV && currSegDir != nextSegDir) return;
        this.lastDirection = dir;
        GameAudio.playSample("./assets/back.wav", GameAudio.SFX);
    }

    gameover() {
        setTimeout(() => {
            this.over = true;
            this.primary.countdown = -1;
            this.primary.anim = 0;
            if (this.onOver) this.onOver();
        });
    }

    start() {
        if (this.running) return;
        this.running = true;

        let ticks = 0;
        let totalTicks = 0;
        let intervalTask = setInterval(() => {
            if (this.onTick) this.onTick();
            
            ticks++;
            totalTicks++;
            const speedups = Math.floor(totalTicks / this.speedupAfterTicks);
            const automoveTicks =
                this.objective == Objective.SCORE? Math.max(this.initialAutomoveTicks - Math.floor(this.primary.snake.calculateLength() / 5), 1) :
                Math.max(this.initialAutomoveTicks - speedups, 1);

            if (this.primary.countdown > 0) {
                if (ticks >= this.countdownTicks) {
                    this.primary.countdown--;
                    this.primary.anim = 0;
                    ticks = 0;
                }
            } else if (ticks >= automoveTicks / (this.hold? 1.8 : 1)) {
                ticks = 0;
                this.primary?.snake.move(this.lastDirection);

                let headLoc = this.primary.snake.calculateHeadLoc();
                if (headLoc[0] < 0 || headLoc[0] >= this.primary.width || headLoc[1] < 0 || headLoc[1] >= this.primary.height) {
                    this.gameover();
                } else if (this.primary.snake.calcuateIntersect(...headLoc)) {
                    if (this.primary.goOver) {
                        this.primary.goOver = false;
                        return;
                    }

                    this.gameover();
                }

                let obj: Object;
                if (obj = this.primary.bag.atEatable(...headLoc)) {
                    let idx = this.primary.bag.objects.indexOf(obj);
                    this.primary.bag.objects.splice(idx, 1);
                    this.primary.bag.update();

                    if (this.objective == Objective.SCORE) {
                        this.primary.score += obj.type == "attack"? 1 : obj.type == "go-over"? 2 : 3;

                        if (obj.type == "reduce-length") {
                            GameAudio.playSample("./assets/back.wav", GameAudio.SFX);
                            this.primary?.snake.cutOff(5);
                        } else {
                            GameAudio.playSample("./assets/click.wav", GameAudio.SFX);
                            let segmentIdx = this.primary.snake.segments[0] == 0? 1 : 0;
                            let segmentDir = this.primary.snake.segments[segmentIdx] > 0? 1 : -1;
                            this.primary.snake.segments[segmentIdx] += segmentDir;
                            this.primary.snake.tail[segmentIdx == 0? 1 : 0] -= segmentDir;
                        }

                        if (obj.type == "go-over") this.primary.goOver = true;
                    }
                }
            }

            if (!this.running || this.over) clearInterval(intervalTask);
        }, 50);
    }

}