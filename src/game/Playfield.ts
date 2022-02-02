import { ObjectBag } from "./ObjectBag";
import { Snake } from "./Snake";

export class Playfield {

    width = 10;
    height = 10;
    player = "Player";
    snake = new Snake();
    bag: ObjectBag;
    countdown = 3;
    anim = 0;

    score = 0;
    goOver = false;

    constructor(rngSeed: bigint) {
        this.bag = new ObjectBag(rngSeed, this);
    }

    initPlayfield() {
        this.snake.tail = [this.getInitialX(), this.getInitialY() + this.getInitialLength()];
        this.snake.segments = [-this.getInitialLength()];
    }

    getInitialLength() { return Math.floor(this.width / 4); }
    getInitialX() { return Math.floor(this.width / 2); }
    getInitialY() { return Math.floor(this.height / 2); }

}