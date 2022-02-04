import { Clock, Connection } from "..";

export class NetworkClock extends Clock {

    currentTick: number = 0;

    constructor(public readonly connection: Connection) {
        super();
    }

}