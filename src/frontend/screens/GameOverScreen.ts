import { popAllScreen, popScreen, sneckMain } from "../..";
import { Cover } from "../../base/Cover";
import { GameConfig } from "../../GameConfig";
import { TextButton } from "../components/TextButton";
import { BlurScreen } from "./BlurScreen";

export class GameOverScreen extends BlurScreen {

    constructor(score: number, reason = "Better luck next time!") {
        super("settings");

        let header = document.createElement("h1");
        header.textContent = "Game Over";
        let subtext = document.createElement("h2");
        subtext.textContent = reason;

        this.dom.append(
            header,
            subtext
        );

        this.append(new TextButton("Score: " + score));
        this.append(new TextButton(score > GameConfig.highScore? "New Highscore!" : ("Highscore: " + GameConfig.highScore)));
        this.append(new TextButton("Back").bindEvent(() => {
            let cover = new Cover();
            sneckMain.append(cover);
            setTimeout(() => cover.fadeIn(), 1);
            setTimeout(() => popAllScreen(), 500);
            setTimeout(() => cover.fadeOut(), 1000);
            setTimeout(() => cover.remove(), 1500);
        }));

        if (score > GameConfig.highScore) GameConfig.highScore = score;
    }

}