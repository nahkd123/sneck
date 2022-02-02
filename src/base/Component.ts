export abstract class Component {

    dom: HTMLDivElement;
    wrapperChild: HTMLDivElement;

    constructor(public name: string) {
        this.dom = document.createElement("div");
        this.dom.className = name;
    }

    initWrapper() {
        this.wrapperChild = document.createElement("div");
        this.wrapperChild.className = "wrapperchild";
        this.dom.append(this.wrapperChild);
    }

    append(comp: Component) {
        let target = this.wrapperChild || this.dom;
        target.appendChild(comp.dom);
        return comp;
    }

    remove() { this.dom.remove(); }

    handleKeyUnderlying(event: KeyboardEvent) {}

}
