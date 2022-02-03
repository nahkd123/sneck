export interface Object {

    type: "attack" | "go-over" | "reduce-length";
    // Map to singleplayer: "apple" | "go-over" | "cut"

    x: number;
    y: number;

}