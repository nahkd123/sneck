import { ProcGen } from "@nahkd123/sneck-commons";
import { sneckMain } from "../..";
import { Screen } from "../../base/Screen";
import { TextButton } from "../components/TextButton";
import { BlurScreen } from "./BlurScreen";
import { SettingsScreen } from "./SettingsScreen";
import { SingleplayerScreen } from "./SingleplayerScreen";

export class HomeScreen extends Screen {

    constructor() {
        super("home");
        this.dom.style.background = ProcGen.gradientBackground(0.1, 0.5);

        let header = document.createElement("h1");
        header.textContent = "Sneck";
        let subtext = document.createElement("h2");
        subtext.textContent = ProcGen.randomOf(ProcGen.RANDOM_STRINGS);

        this.dom.append(
            header,
            subtext
        );

        this.append(new TextButton("Singleplayer").bindEvent(() => sneckMain.append(new SingleplayerScreen())));
        this.append(new TextButton("Multiplayer", false));
        this.append(new TextButton("Settings").bindEvent(() => sneckMain.append(new SettingsScreen())));
        this.append(new TextButton("About").bindEvent(() => {
            let blurScreen = new BlurScreen("about");
            blurScreen.dom.textContent = `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.`;
            sneckMain.append(blurScreen);
        }));
    }

}