import { Screen } from "../../base/Screen";

export class BlurScreen extends Screen {

    constructor(public screenName: string) {
        super("blurscreen");
        this.dom.classList.add(screenName);
    }

}