import { popScreen, sneckFocused, sneckMain } from "../..";
import { Direction } from "../../game/Direction";
import { Game } from "../../game/Game";
import { GameConfig } from "../../GameConfig";
import { ProcGen } from "../../utils/ProcGen";
import { PlayfieldComponent } from "../components/PlayfieldComponent";
import { StatisticsBar } from "../components/StatisticsBar";
import { StatisticValue } from "../components/StatisticValue";
import { FadeScreen } from "./FadeScreen";
import { GameOverScreen } from "./GameOverScreen";

export class GameScreen extends FadeScreen {

    playfield: PlayfieldComponent;

    statsLeft: StatisticsBar;
    statsInventory: StatisticValue;

    statsRight: StatisticsBar;
    statsScore: StatisticValue;

    playfieldOffset: [number, number] = [0, 0];
    playfieldOffsetControl: [number, number] = [0, 0];

    constructor(public readonly game: Game) {
        super("game");
        game.primary.initPlayfield();
        this.playfield = new PlayfieldComponent(game.primary);
        this.append(this.playfield);

        this.append(this.statsLeft = new StatisticsBar("left"));
        this.statsLeft.append(this.statsInventory = new StatisticValue("Inventory", ""));

        this.append(this.statsRight = new StatisticsBar("right"));
        this.statsRight.append(this.statsScore = new StatisticValue("Score", "1,337"));

        game.onTick = () => {
            this.statsInventory.value.textContent = game.primary.goOver? "Go Over" : "";

            this.statsScore.value.textContent = game.primary.score + "";
        };

        game.onOver = () => {
            setTimeout(() => {
                this.game.running = false;
                sneckFocused[0] = null;
                sneckMain.append(new GameOverScreen(game.primary.score));
            }, 2250);
        };

        this.dom.style.background = ProcGen.gradientBackground(0.1, 0.7);

        let activePointer = -1;
        let pointerXY: [number, number] = [0, 0];
        let moveRegisterDistance = 3;

        this.playfield.dom.addEventListener("pointerdown", event => {
            if (activePointer != -1) return;
            activePointer = event.pointerId;
            pointerXY = [event.pageX, event.pageY];

            let pointerMove = (event: PointerEvent) => {
                if (event.pointerId != activePointer) return;
                // console.log(event);
                this.playfieldOffsetControl[0] = (event.pageX - pointerXY[0]) / 10;
                this.playfieldOffsetControl[1] = (event.pageY - pointerXY[1]) / 10;
                if (event.pageX - pointerXY[0] < -moveRegisterDistance) this.game.setNext(Direction.LEFT);
                if (event.pageX - pointerXY[0] > moveRegisterDistance) this.game.setNext(Direction.RIGHT);
                if (event.pageY - pointerXY[1] < -moveRegisterDistance) this.game.setNext(Direction.UP);
                if (event.pageY - pointerXY[1] > moveRegisterDistance) this.game.setNext(Direction.DOWN);
            };
            let pointerUp = (event: PointerEvent) => {
                if (event.pointerId != activePointer) return;
                document.removeEventListener("pointermove", pointerMove);
                document.removeEventListener("pointerup", pointerUp);

                this.playfieldOffsetControl[0] = 0;
                this.playfieldOffsetControl[1] = 0;
                activePointer = -1;
            };
            
            document.addEventListener("pointermove", pointerMove);
            document.addEventListener("pointerup", pointerUp);
        });
    }

    initRenderer() {
        let prevTs = -1;
        let render = (ts: number) => {
            if (prevTs == -1) {
                prevTs = ts;
                window.requestAnimationFrame(render);
                return;
            }

            const frameTime = ts - prevTs;

            if (GameConfig.bobbing) {
                const pfOffTo: [number, number] = [0, 0];
                pfOffTo[0] += this.playfieldOffsetControl[0];
                pfOffTo[1] += this.playfieldOffsetControl[1];
            
                this.playfieldOffset[0] = pfOffTo[0] * 0.1 + this.playfieldOffset[0] * 0.9;
                this.playfieldOffset[1] = pfOffTo[1] * 0.1 + this.playfieldOffset[1] * 0.9;
            }

            this.playfield.canvas.dom.style.transform = `translate(${this.playfieldOffset[0]}px, ${this.playfieldOffset[1]}px)`;
            this.statsLeft.dom.style.transform = `translate(${this.playfieldOffset[0]}px, ${this.playfieldOffset[1]}px)`;
            this.statsRight.dom.style.transform = `translate(${this.playfieldOffset[0]}px, ${this.playfieldOffset[1]}px)`;
            this.playfield.playerName.style.transform = `translate(${this.playfieldOffset[0]}px, ${this.playfieldOffset[1]}px)`;

            if (!this.game.running) return;
            this.playfield.playfield.anim += frameTime;
            this.playfield.update();

            prevTs = ts;
            window.requestAnimationFrame(render);
        };
        window.requestAnimationFrame(render);
    }

    handleKeyUnderlying(event: KeyboardEvent): void {
        if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
            if (event.type == "keydown") {
                this.game.hold = true;
                if (event.code == "KeyW") {
                    this.game.setNext(Direction.UP);
                    this.playfieldOffsetControl[1] = -5;
                }
                if (event.code == "KeyA") {
                    this.game.setNext(Direction.LEFT);
                    this.playfieldOffsetControl[0] = -5;
                }
                if (event.code == "KeyS") {
                    this.game.setNext(Direction.DOWN);
                    this.playfieldOffsetControl[1] = 5;
                }
                if (event.code == "KeyD") {
                    this.game.setNext(Direction.RIGHT);
                    this.playfieldOffsetControl[0] = 5;
                }
            } else if (event.type == "keyup") {
                this.game.hold = false;
                if (event.code == "KeyW") this.playfieldOffsetControl[1] = 0;
                if (event.code == "KeyA") this.playfieldOffsetControl[0] = 0;
                if (event.code == "KeyS") this.playfieldOffsetControl[1] = 0;
                if (event.code == "KeyD") this.playfieldOffsetControl[0] = 0;
            }
        }
    }

}
