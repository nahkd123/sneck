import { Component } from "../../base/Component";
import { GameAudio } from "../../GameAudio";

export class TextButton extends Component {

    constructor(label: string, enabled = true) {
        super("text-button");
        this.dom.textContent = label;
        if (!enabled) this.dom.classList.add("disabled");

        this.dom.addEventListener("mouseover", () => {
            GameAudio.playSample("./assets/select_hard.wav", GameAudio.SFX);
        });
        this.dom.addEventListener("mousedown", () => {
            GameAudio.playSample("./assets/click.wav", GameAudio.SFX);
        });
    }

    bindEvent(cb: () => any) { this.dom.addEventListener("click", cb); return this; }
    
}