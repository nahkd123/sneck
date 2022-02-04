import { ProcGen } from "..";
import { Object } from "./Object";

export class ObjectBag {

    randomizer: ProcGen.Random;

    objects: Object[] = [];
    eatables = 5;
    overheads = 10;

    constructor(
        public readonly width: number,
        public readonly height: number
    ) {}

    getEatables() {
        let obj: Object[] = [];
        for (let i = 0; i < this.eatables; i++) obj.push(this.objects[i]);
        return obj;
    }

    indexAt(x = 0, y = 0) { return this.objects.findIndex(v => v.x == x && v.y == y); }
    at(x = 0, y = 0) { return this.objects[this.indexAt(x, y)]; }
    atEatable(x = 0, y = 0) {
        const idx = this.indexAt(x, y);
        if (idx >= this.eatables) return null;
        return this.at(x, y);
    }

    serverUpdate() {
        while (this.objects.length < this.overheads + this.eatables) {
            const nextTypeChance = this.randomizer.nextFloat();
            const nextType: Object["type"] =
                nextTypeChance <= 0.05? "cut" :
                nextTypeChance <= 0.15? "go-over":
                "apple";
            let nextX: number, nextY: number;
            do {
                nextX = this.randomizer.nextIntWord() % this.width;
                nextY = this.randomizer.nextIntWord() % this.height;
            } while (this.at(nextX, nextY) != null);
            this.objects.push({
                type: nextType,
                x: nextX,
                y: nextY
            });
        }
    }

}