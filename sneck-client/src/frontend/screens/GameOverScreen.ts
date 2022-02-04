import { popAllScreen, sneckFocused, sneckMain } from "../..";
import { Cover } from "../../base/Cover";
import { GameConfig } from "../../GameConfig";
import { Icon } from "../components/Icon";
import { BlurScreen } from "./BlurScreen";

export class GameOverScreen extends BlurScreen {

    closeButton: Icon;

    constructor(score: number, title = "Game Over", subtitle = "Unknown gamemode") {
        super("game-over");

        let subtext = document.createElement("h2");
        subtext.textContent = subtitle;
        let header = document.createElement("h1");
        header.textContent = title;

        this.dom.append(
            subtext,
            header,
        );

        this.append(this.closeButton = new Icon("close"));

        if (score > GameConfig.highScore) GameConfig.highScore = score;

        this.closeButton.dom.addEventListener("click", () => this.coverToMainMenu());
    }

    handleKeyUnderlying(event: KeyboardEvent): void {
        if (event.code == "Escape") this.coverToMainMenu();
    }

    coverToMainMenu() {
        let cover = new Cover();
        sneckMain.append(cover);
        sneckFocused[0] = null;
        setTimeout(() => cover.fadeIn(), 5);
        setTimeout(() => popAllScreen(), 500);
        setTimeout(() => cover.fadeOut(), 510);
        setTimeout(() => cover.remove(), 1100);
    }

}