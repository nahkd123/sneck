import { Component } from "../../base/Component";
import { GameAudio } from "../../GameAudio";

export class PlayerGameResult extends Component {

    positionDiv = document.createElement("div");
    detailsDiv = document.createElement("div");

    playerNameDiv = document.createElement("div");
    objectsDiv = document.createElement("div");
    damageDiv = document.createElement("div");

    constructor(
        public readonly playerName: string,
        public readonly position: number,
        public readonly objects: [number, number, number],
        public readonly damageDealt: number,
        public readonly damageReceived: number
    ) {
        super("player-game-result");

        this.dom.classList.add("position-" + position);
        this.positionDiv.className = "position";
        this.positionDiv.textContent = "#" + (position + 1);

        this.detailsDiv.className = "details";
        this.playerNameDiv.className = "player-name";
        this.playerNameDiv.textContent = playerName;

        this.objectsDiv.textContent = `${objects[0]} apples | ${objects[1]} go overs | ${objects[2]} cuts`;
        if (damageDealt > 0 || damageReceived > 0) {
            this.damageDiv.textContent = `${damageDealt} damages dealt | ${damageReceived} damages received`;
        }
        
        this.detailsDiv.append(
            this.playerNameDiv,
            this.objectsDiv,
            this.damageDiv
        );

        this.dom.append(
            this.positionDiv,
            this.detailsDiv
        );
    }

}