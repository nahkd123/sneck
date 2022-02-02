import { Component } from "./Component";

export class Canvas extends Component {

    backed: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    onUpdate: () => any;

    constructor() {
        super("canvas");
        this.backed = document.createElement("canvas");
        this.ctx = this.backed.getContext("2d");
        this.dom.append(this.backed);

        new ResizeObserver(() => {
            this.updateAutoSize();
        }).observe(this.backed);
    }

    /**
     * Update canvas rendering size when the canvas physical size is modified by
     * CSS
     */
    updateAutoSize() {
        let rw = Math.floor(this.backed.offsetWidth * devicePixelRatio);
        let rh = Math.floor(this.backed.offsetHeight * devicePixelRatio);
        if (this.backed.width != rw || this.backed.height != rh) {
            this.backed.width = rw;
            this.backed.height = rh;
            if (this.onUpdate) this.onUpdate();
        }
    }

}