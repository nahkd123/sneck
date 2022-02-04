import { Clock } from "./Clock";

export class LocalClock extends Clock {

    startTime: number;
    get currentTick() { return Math.floor((Date.now() - this.startTime) / this.msPerTick); }

    constructor() {
        super();
        this.startTime = Date.now();
    }

}