import { Component } from "./Component";

export class Document extends Component {

    constructor() { super(""); }

    append(comp: Component): void { document.body.appendChild(comp.dom); }

}
