export namespace ProcGen {

    export const RANDOM_STRINGS = [
        "cute little \"snake!\"",
        "Snake gaming",
        "Powered by JavaScript",
        "Powered by TypeScript",
        "1k stars and I'll add customization menu",
        "amogus",
        "Made by nahkd123",
        `window.location.href = atob("aHR0cHM6Ly95b3V0dS5iZS9kUXc0dzlXZ1hjUQ==")`,
        "gaming",
        "dksaldjskaljdaljwllajdklawjd"
    ];

    export function randomOf<T>(arr: T[]) { return arr[Math.floor(arr.length * Math.random())]; }

    export function randomBetween(a: number, b: number) {
        const dist = b - a;
        return a + Math.random() * dist;
    }

    export function rgb(minAmp = 0, maxAmp = 1) {
        return `rgb(${Math.floor(randomBetween(minAmp, maxAmp) * 255)}, ${Math.floor(randomBetween(minAmp, maxAmp) * 255)}, ${Math.floor(randomBetween(minAmp, maxAmp) * 255)})`;
    }

    export function gradientBackground(minAmp = 0, maxAmp = 1) {
        return `linear-gradient(225deg, ${rgb(minAmp, maxAmp)} 0%, ${rgb(minAmp, maxAmp)} 100%)`;
    }

    const multiplier = 0x5DEECE66Dn;
    const addend = 0xBn;
    const mask = (1n << 48n) - 1n;
    function initialScramble(seed: bigint) { return (seed ^ multiplier) & mask; }

    export class Random {

        seed: bigint;

        constructor(seed: bigint = BigInt(Date.now())) {
            this.seed = initialScramble(seed);
        }

        nextIntWord() {
            let oldSeed: bigint;
            let newSeed: bigint;
            do {
                if (newSeed != null) this.seed = newSeed;
                oldSeed = this.seed;
                newSeed = (oldSeed * multiplier + addend) & mask;
            } while (this.seed != oldSeed)
            this.seed = newSeed;
            return Number(newSeed >> 16n);
        }

        nextFloat() {
            return this.nextIntWord() / 0xFFFFFFFF;
        }

    }

}
