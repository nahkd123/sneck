import { popScreen, sneckFocused, sneckMain } from "../..";
import { Connection, Direction, Game, ProcGen } from "@nahkd123/sneck-commons";
import { GameConfig } from "../../GameConfig";
import { FadeScreen } from "./FadeScreen";
import { PlayerComponent } from "../components/PlayerComponent";
import { GameScreenText } from "../components/GameScreenText";
import { GameOverScreen } from "./GameOverScreen";
import { PlayerGameResult } from "../components/PlayerGameResult";

export class GameScreen extends FadeScreen {

    get game() { return this.connection.game; }
    players: PlayerComponent[];
    gamemode = "Unknown Gamemode";

    constructor(
        public readonly connection: Connection
    ) {
        super("game");

        this.dom.style.background = ProcGen.gradientBackground(0.1, 0.7);
        this.players = connection.game.players.map(v => {
            let comp = new PlayerComponent(v);
            this.append(comp);
            return comp;
        });

        connection.onClientEvent = event => {
            console.log(event);
            if (event.event == "countdown") {
                if (event.countdown >= GameConfig.countdownText.length) return;
                const text = GameConfig.countdownText[GameConfig.countdownText.length - event.countdown - 1];
                const comp = new GameScreenText(text);
                this.append(comp);
                setTimeout(() => comp.remove(), 1150);
            } else if (event.event == "game-over") {
                const comp = new GameScreenText(GameConfig.gameoverText);
                this.append(comp);
                setTimeout(() => comp.remove(), 1150);
                setTimeout(() => {
                    const screen = new GameOverScreen(
                        connection.player.score,
                        // TODO: Add multiplayer PvP ranking
                        connection.game.players.length > 1? `#???` : `${connection.player.score}`,
                        this.gamemode
                    );
                    const e = new PlayerGameResult(connection.player.name, 0, connection.player.objects, 0, 0);
                    screen.append(e);
                    sneckMain.append(screen);
                    sneckFocused[0] = screen;

                    this.players.forEach(p => p.keepRendering = false);    
                }, 2000);
            } else if (event.event == "eliminate") {
                // TODO: Eliminate animation
            }
        };
    }

    handleKeyUnderlying(event: KeyboardEvent): void {
        if (this.game.currentPlayer) {
            let holding = event.type == "keydown";
            if (event.code == "KeyW" || event.code == "ArrowUp")    this.connection.sendMove(Direction.UP, holding);
            if (event.code == "KeyA" || event.code == "ArrowLeft")  this.connection.sendMove(Direction.LEFT, holding);
            if (event.code == "KeyS" || event.code == "ArrowDown")  this.connection.sendMove(Direction.DOWN, holding);
            if (event.code == "KeyD" || event.code == "ArrowRight") this.connection.sendMove(Direction.RIGHT, holding);
        }
    }

}
