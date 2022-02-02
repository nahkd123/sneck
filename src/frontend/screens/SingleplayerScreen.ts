import { popScreen, sneckFocused, sneckMain } from "../..";
import { Game } from "../../game/Game";
import { Objective } from "../../game/Objective";
import { Playfield } from "../../game/Playfield";
import { ProcGen } from "../../utils/ProcGen";
import { TextButton } from "../components/TextButton";
import { FadeScreen } from "./FadeScreen";
import { GameScreen } from "./GameScreen";

export class SingleplayerScreen extends FadeScreen {

    constructor() {
        super("singleplayer");
        this.dom.style.background = ProcGen.gradientBackground(0.1, 0.5);

        let header = document.createElement("h1");
        header.textContent = "Singleplayer";
        let subtext = document.createElement("h2");
        subtext.textContent = "Play sneck alone";

        this.dom.append(
            header,
            subtext
        );

        this.append(new TextButton("Play").bindEvent(() => {
            let game = new Game(Objective.SCORE);
            game.primary = new Playfield(BigInt(Date.now()));
            game.primary.width = 10;
            game.primary.height = 10;
            game.primary.bag.update();
            
            let screen = new GameScreen(game);
            sneckMain.append(sneckFocused[0] = screen);
            console.log(game);

            game.start();
            screen.initRenderer();
        }));
        this.append(new TextButton("Back").bindEvent(() => popScreen()));
    }

}