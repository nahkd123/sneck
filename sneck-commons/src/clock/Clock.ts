export abstract class Clock {

    abstract currentTick: number;
    ticksPerSec = 20;

    get msPerTick() { return 1000 / this.ticksPerSec; }

}
