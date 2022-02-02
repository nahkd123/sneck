import { Component } from "./Component";

export class Cover extends Component {

    constructor() {
        super("cover");
    }

    fadeIn() { this.dom.classList.add("fade"); }
    fadeOut() { this.dom.classList.remove("fade"); }

}