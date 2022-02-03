import { Canvas } from "../../base/Canvas";
import { Component } from "../../base/Component";
import { Playfield } from "../../game/Playfield";
import { GameConfig } from "../../GameConfig";

export class PlayfieldComponent extends Component {

    canvas: Canvas;
    playerName: HTMLDivElement;

    constructor(public playfield: Playfield) {
        super("playfield");
        this.initWrapper();

        this.canvas = new Canvas();
        this.playerName = document.createElement("div");
        this.playerName.className = "player-name";

        this.append(this.canvas);
        this.wrapperChild.append(this.playerName);

        this.canvas.onUpdate = () => {
            const ctx = this.canvas.ctx;
            ctx.resetTransform();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            let pxPerTile: number;// = Math.max(playfield.width, playfield.height);
            if (playfield.width > playfield.height) pxPerTile = ctx.canvas.width / playfield.width;
            else pxPerTile = ctx.canvas.height / playfield.height;
            let halfPxPerTile = pxPerTile / 2;

            let fillCircle = (fill: string, x = 0, y = 0, r = 1) => {
                ctx.fillStyle = fill;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            };

            // Render grid
            // TODO: Add toggle for toggling grid to reduce frame time
            if (GameConfig.renderGrid) for (let y = 0; y < playfield.height; y++) {
                for (let x = 0; x < playfield.width; x++) {
                    fillCircle("#FFFFFF1A", x * pxPerTile + halfPxPerTile, y * pxPerTile + halfPxPerTile, halfPxPerTile * 0.4);
                }
            }

            // Render objects
            for (let i = 0; i < playfield.bag.configEatableObjects; i++) {
                const obj = playfield.bag.objects[i];
                if (GameConfig.renderBloom) {
                    ctx.shadowBlur = 16;
                    ctx.shadowColor = GameConfig.objectsColor[obj.type][1];
                }
                fillCircle(GameConfig.objectsColor[obj.type][1], obj.x * pxPerTile + halfPxPerTile, obj.y * pxPerTile + halfPxPerTile, halfPxPerTile * 0.70);
                if (GameConfig.renderBloom) ctx.shadowBlur = 0;

                fillCircle(GameConfig.objectsColor[obj.type][0], obj.x * pxPerTile + halfPxPerTile, obj.y * pxPerTile + halfPxPerTile, halfPxPerTile * 0.55);
            }

            // Render snake
            if (GameConfig.renderBloom) {
                ctx.shadowBlur = 16;
                ctx.shadowColor = GameConfig.snakeColor + "3F";
            }
            ctx.strokeStyle = GameConfig.snakeColor;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = pxPerTile * 0.75;
            ctx.beginPath();
            ctx.moveTo(
                playfield.snake.tail[0] * pxPerTile + halfPxPerTile,
                playfield.snake.tail[1] * pxPerTile + halfPxPerTile
            );
            let xy: [number, number] = [...playfield.snake.tail];
            for (let i = 0; i < playfield.snake.segments.length; i++) {
                const isV = (i % 2) == 0;
                const segL = playfield.snake.segments[i];
                xy[isV? 1 : 0] += segL;
                ctx.lineTo(
                    xy[0] * pxPerTile + halfPxPerTile,
                    xy[1] * pxPerTile + halfPxPerTile
                );
            }
            ctx.stroke();
            ctx.closePath();
            if (GameConfig.renderBloom) ctx.shadowBlur = 0;

            fillCircle(GameConfig.snakeEyeColor, xy[0] * pxPerTile + halfPxPerTile, xy[1] * pxPerTile + halfPxPerTile, halfPxPerTile * 0.50);

            // Countdown
            if (playfield.countdown >= 0 && playfield.countdown < 3 && playfield.anim <= 1000) {
                const TEXT = ["GO", "SET", "READY"];
                const ct = TEXT[playfield.countdown];
                ctx.textAlign = "center";
                ctx.fillStyle = GameConfig.countdownColor;

                ctx.globalAlpha = 1 - (playfield.anim / 1000);
                ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
                
                ctx.font = "72px Roboto Condensed";
                if (GameConfig.renderBloom) {
                    ctx.shadowBlur = 16;
                    ctx.shadowColor = GameConfig.countdownColor + "7F";
                }
                ctx.fillText(ct, 0, 72 / 2);
                if (GameConfig.renderBloom) ctx.shadowBlur = 0;

                ctx.globalAlpha = 1;
                ctx.translate(-(ctx.canvas.width / 2), -(ctx.canvas.height / 2));
            } else if (playfield.countdown == -1 && playfield.anim <= 2250) {
                ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

                ctx.textAlign = "center";
                ctx.fillStyle = GameConfig.countdownColor;
                ctx.font = "64px Roboto Condensed";
                ctx.filter = `hue-rotate(${playfield.anim / 500 * 360}deg)`;
                ctx.globalAlpha = playfield.anim <= 250? (playfield.anim / 250) : (1 - ((playfield.anim - 250) / 2000));

                if (GameConfig.renderBloom) {
                    ctx.shadowBlur = 16;
                    ctx.shadowColor = GameConfig.countdownColor + "7F";
                }
                ctx.fillText("GAME OVER", 0, 64 / 2);
                if (GameConfig.renderBloom) ctx.shadowBlur = 0;
                
                ctx.globalAlpha = 1;
                ctx.filter = "none";
                ctx.translate(-(ctx.canvas.width / 2), -(ctx.canvas.height / 2));
            }
        };

        this.update();
    }

    update() {
        if (this.playerName.textContent != this.playfield.player) this.playerName.textContent = this.playfield.player;
        if (this.canvas.onUpdate) this.canvas.onUpdate();
    }

}