import { Object } from "@nahkd123/sneck-commons";

export namespace GameConfig {

    export let renderGrid = true;
    export let renderBloom = true;
    export let bobbing = true;

    // TODO: Cosmetic
    export let snakeColor = "#FFFFFF";
    export let snakeEyeColor = "#5c5c5c";
    export let objectsColor: Record<Object["type"], string[]> = {
        "apple": ["#FFB877", "#FF8933"],
        "go-over": ["#9BE7FF", "#33CEFF"],
        "cut": ["#7AFF77", "#28E924"]
    };
    export let countdownColor = "#FFCFAF";

    // Translations
    export let countdownText = ["READY", "SET", "GO"];
    export let gameoverText = "GAME OVER";

    // scoring thing haha what am i doing...
    export let highScore = 0;

}