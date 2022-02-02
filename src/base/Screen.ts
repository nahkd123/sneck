import { Component } from "./Component";

export abstract class Screen extends Component {

    constructor(public screenName: string) {
        super("screen");
        this.dom.classList.add(screenName);
        this.playShowAnimation();
    }

    playShowAnimation() {
        setTimeout(() => this.dom.classList.add("show"), 1);
    }

    playCloseAnimation() {
        this.dom.classList.remove("show");
    }

}
