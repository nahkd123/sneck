import { Component } from "../../base/Component";

export class GameScreenText extends Component {

    constructor(text: string) {
        super("game-screen-text");
        this.dom.textContent = text;
    }

}