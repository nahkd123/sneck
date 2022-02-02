import { Component } from "../../base/Component";

export class StatisticsBar extends Component {

    constructor(side: "left" | "right") {
        super("statistics-bar");
        this.dom.classList.add(side);
    }

}