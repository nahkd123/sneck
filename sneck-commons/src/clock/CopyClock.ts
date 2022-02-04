import { Clock } from "..";

export class CopyClock extends Clock {

    get currentTick() { return this.copying.currentTick; }

    constructor(public copying: Clock) {
        super();
    }

}