import { Screen } from "../../base/Screen";

export class FadeScreen extends Screen {

    constructor(public screenName: string) {
        super("fadescreen");
        this.dom.classList.add(screenName);
    }

}