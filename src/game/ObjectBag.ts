import { ProcGen } from "../utils/ProcGen";
import { Object } from "./Object";
import { Playfield } from "./Playfield";

export class ObjectBag {

    /**
     * Number of objects that can be choosen to eat. Configured by host (with
     * the maximum value = 15)
     */
    configEatableObjects = 5;

    /**
     * Number of objects that this object bag will generate. Configured by
     * host (with the maximum value = 25)
     */
    configBagOverhead = 10;

    // The first n objects are marked as eatable
    objects: Object[] = [];
    randomizer: ProcGen.Random;

    constructor(seed: bigint, public readonly playfield: Playfield) {
        this.randomizer = new ProcGen.Random(seed);
    }

    at(x = 0, y = 0) { return this.objects.find(v => v.x == x && v.y == y); }
    atEatable(x = 0, y = 0) {
        let idx = this.objects.findIndex(v => v.x == x && v.y == y);
        if (idx <= -1 || idx >= this.configEatableObjects) return null;
        return this.objects[idx] || null;
    }

    update() {
        while (this.objects.length < this.configEatableObjects + this.configBagOverhead) this.#newObject();
    }

    #newObject() {
        let objPosX: number;
        let objPosY: number;
        let objTypeRng = this.randomizer.nextFloat();
        do {
            objPosX = Math.floor(this.randomizer.nextFloat() * this.playfield.width);
            objPosY = Math.floor(this.randomizer.nextFloat() * this.playfield.height);
        } while (this.at(objPosX, objPosY) != null);

        this.objects.push({
            type: objTypeRng < 0.08? "go-over" : objTypeRng < 0.15? "reduce-length" : "attack",
            x: objPosX,
            y: objPosY
        });
    }

}