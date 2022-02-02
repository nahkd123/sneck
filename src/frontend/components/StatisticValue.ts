import { Component } from "../../base/Component";

export class StatisticValue extends Component {

    label: HTMLDivElement;
    value: HTMLDivElement;

    constructor(label: string, value: string) {
        super("statistic-value");
        this.label = document.createElement("div");
        this.label.textContent = label;
        this.label.className = "label";

        this.value = document.createElement("div");
        this.value.textContent = value;
        this.value.className = "value";

        this.dom.append(
            this.label,
            this.value
        );
    }

}