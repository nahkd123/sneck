import { Direction, Objective, Player } from "@nahkd123/sneck-commons";
import { Canvas } from "../../base/Canvas";
import { Component } from "../../base/Component";
import { GameConfig } from "../../GameConfig";
import { StatisticsBar } from "./StatisticsBar";
import { StatisticValue } from "./StatisticValue";

export class PlayerComponent extends Component {

    board: Canvas;
    #bobbing: [number, number] = [0, 0];
    bobbing: [number, number] = [0, 0];

    left: StatisticsBar;
    right: StatisticsBar;
    playerName: HTMLDivElement;

    inventory: StatisticValue;
    score: StatisticValue;

    constructor(public readonly player: Player) {
        super("player");

        this.board = new Canvas();
        this.append(this.board);

        this.append(this.left = new StatisticsBar("left"));
        this.append(this.right = new StatisticsBar("right"));

        this.playerName = document.createElement("div");
        this.playerName.className = "player-name";
        this.playerName.textContent = player.name || "Player";
        this.dom.appendChild(this.playerName);

        // Stats
        this.inventory = new StatisticValue("Inventory", "");
        this.score = new StatisticValue("Score", "0");

        this.left.append(this.inventory);

        if (player.game.rule.objective == Objective.SCORE) {
            this.right.append(this.score);
        }
        
        // Update
        player.onUpdate = () => {
            this.playerName.textContent = player.name || "Player";

            this.score.value.textContent = "" + player.score;
            this.inventory.value.textContent = player.hasGoOver? "Go Over" : "";
        };

        this.initRenderer();
    }

    keepRendering = true;

    initRenderer() {
        this.keepRendering = true;
        let render = () => {
            if (!this.keepRendering) return;
            this.renderBoard();
            window.requestAnimationFrame(render);
        }
        window.requestAnimationFrame(render);
    }

    renderBoard() {
        // TODO: Render to canvas
        this.board.updateAutoSize();
        const ctx = this.board.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const tileW = this.player.game.width;
        const tileH = this.player.game.height;
        const tile =
            Math.min(ctx.canvas.width, ctx.canvas.height) /
            Math.min(tileW, tileH)
        ;
        const htile = tile / 2;

        let fillCircle = (x = 0, y = 0, r = 0) => {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        if (GameConfig.renderGrid) {
            ctx.fillStyle = "#FFFFFF1A";
            for (let y = 0; y < tileH; y++) for (let x = 0; x < tileW; x++) {
                fillCircle(x * tile + htile, y * tile + htile, htile * 0.4);
            }
        }

        // Objects
        for (let i = 0; i < this.player.bag.eatables; i++) {
            const obj = this.player.bag.objects[i];
            if (GameConfig.renderBloom) {
                ctx.shadowBlur = 16;
                ctx.shadowColor = GameConfig.objectsColor[obj.type][1];
            }
            ctx.fillStyle = GameConfig.objectsColor[obj.type][1];
            fillCircle(obj.x * tile + htile, obj.y * tile + htile, htile * 0.7);
            if (GameConfig.renderBloom) ctx.shadowBlur = 0;
            
            ctx.fillStyle = GameConfig.objectsColor[obj.type][0];
            fillCircle(obj.x * tile + htile, obj.y * tile + htile, htile * 0.55);
        }

        // Snake
        if (GameConfig.renderBloom) {
            ctx.shadowBlur = 16;
            ctx.shadowColor = GameConfig.snakeColor + "3F";
        }

        ctx.strokeStyle = GameConfig.snakeColor;
        ctx.lineWidth = tile * 0.7;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        const xy: [number, number] = [...this.player.snake.tail];
        ctx.moveTo(xy[0] * tile + htile, xy[1] * tile + htile);
        for (let i = 0; i < this.player.snake.segments.length; i++) {
            const l = this.player.snake.segments[i];
            xy[(i % 2) == 0? 1 : 0] += l;
            ctx.lineTo(xy[0] * tile + htile, xy[1] * tile + htile);
        }
        ctx.stroke();
        ctx.closePath();
        if (GameConfig.renderBloom) ctx.shadowBlur = 0;

        ctx.fillStyle = GameConfig.snakeEyeColor;
        fillCircle(xy[0] * tile + htile, xy[1] * tile + htile, htile * 0.50);

        if (GameConfig.bobbing) {
            this.dom.style.transform = `translate(${this.#bobbing[0]}px, ${this.#bobbing[1]}px)`;
            this.#bobbing[0] = this.bobbing[0] * 0.1 + this.#bobbing[0] * 0.9;
            this.#bobbing[1] = this.bobbing[1] * 0.1 + this.#bobbing[1] * 0.9;
            
            this.bobbing[0] = 0; this.bobbing[1] = 0;
            if (this.player.holding) {
                if (this.player.lastInput == Direction.UP) this.bobbing[1] = -5;
                else if (this.player.lastInput == Direction.DOWN) this.bobbing[1] = 5;
                if (this.player.lastInput == Direction.LEFT) this.bobbing[0] = -5;
                else if (this.player.lastInput == Direction.RIGHT) this.bobbing[0] = 5;
            }
        }
    }

}