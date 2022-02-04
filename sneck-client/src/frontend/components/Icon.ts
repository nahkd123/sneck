import { Component } from "../../base/Component";

export class Icon extends Component {

    constructor(name: string) {
        super("icon");
        this.dom.classList.add(name);
        this.initWrapper();
    }

}