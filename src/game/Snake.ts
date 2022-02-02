import { Direction } from "./Direction";

export class Snake {

    /**
     * Snake tail location in the playfield
     */
    tail: [number, number];

    segments: number[];
    // Segments orders: VERTICAL -> HORIZONTAL -> VERTICAL -> ...
    // If the snake segment does not starts with vertical, the value would be 0
    // Matrix:       | Positive    | Negative    |
    //               |---------------------------|
    //  - VERTICAL   | Down        | Up          |
    //  - HORIZONTAL | Right       | Left        |

    calculateHeadLoc() {
        let xy: [number, number] = [...this.tail]
        for (let i = 0; i < this.segments.length; i++) {
            xy[(i % 2)? 0 : 1] += this.segments[i];
        }
        return xy;
    }

    calcuateIntersect(x = 0, y = 0) {
        if (x == this.tail[0] && y == this.tail[1]) return true;
        let xy: [number, number] = [...this.tail]
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i] == 0) continue;

            const dir = this.segments[i] > 0? 1 : -1;
            for (let j = 0; j < Math.abs(this.segments[i]); j++) {
                const pointX = xy[0] + ((i % 2)? j * dir : 0);
                const pointY = xy[1] + ((i % 2)? 0 : j * dir);
                if (x == pointX && y == pointY) return true;
            }
            xy[(i % 2)? 0 : 1] += this.segments[i];
        }
        return false;
    }

    calculateLength() {
        return Math.abs(this.segments.reduce((a, b) => Math.abs(a) + Math.abs(b)));
    }

    move(dir: Direction) {
        this.afterMove();
        const currentOrentIsV = (this.segments.length % 2) == 1;
        const nextIsV = dir == Direction.UP || dir == Direction.DOWN;
        const breakSegment = nextIsV != currentOrentIsV;
        const movingSegmentDir = (dir == Direction.DOWN || dir == Direction.RIGHT)? 1 : -1;
        if (!breakSegment) {
            this.segments[this.segments.length - 1] += movingSegmentDir;
        } else {
            this.segments.push(movingSegmentDir);
        }
        const shiftV = this.segments[0] != 0? 1 : 0;
        this.tail[shiftV? 1 : 0] += this.segments[shiftV? 0 : 1] > 0? 1 : -1;
        this.segments[shiftV? 0 : 1] += this.segments[shiftV? 0 : 1] > 0? -1 : 1;
    }

    cutOff(amount: number) {
        const initialLength = this.calculateLength();
        amount = Math.min(initialLength - 1, amount);

        let nextTail: [number, number] = [...this.tail];
        this.tail = nextTail;

        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i] == 0) continue;
            const dir = this.segments[i] > 0? 1 : -1;
            const segLength = Math.abs(this.segments[i]);
            const reduceBy = Math.min(amount, segLength);
            this.segments[i] -= reduceBy * dir;
            amount -= reduceBy;

            nextTail[(i % 2) == 0? 1 : 0] += reduceBy * dir;
            if (amount <= 0) break;
        }
        return amount;
    }

    afterMove() {
        if (this.segments.length >= 2 && this.segments[0] == 0 && this.segments[1] == 0) {
            this.segments.splice(0, 2);
        }
    }

}