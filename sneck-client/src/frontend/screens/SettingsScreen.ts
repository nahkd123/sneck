import { popScreen, sneckMain } from "../..";
import { GameConfig } from "../../GameConfig";
import { TextButton } from "../components/TextButton";
import { BlurScreen } from "./BlurScreen";

export class SettingsScreen extends BlurScreen {

    constructor() {
        super("settings");

        let header = document.createElement("h1");
        header.textContent = "Settings";
        let subtext = document.createElement("h2");
        subtext.textContent = "Edit game settings";

        this.dom.append(
            header,
            subtext
        );

        let gridBtn: TextButton;
        let bloomBtn: TextButton;
        let bobbingBtn: TextButton;

        this.append(gridBtn = new TextButton("Grid: " + (GameConfig.renderGrid? "On" : "Off")).bindEvent(() => {
            GameConfig.renderGrid = !GameConfig.renderGrid;
            gridBtn.dom.textContent = "Grid: " + (GameConfig.renderGrid? "On" : "Off");
        }));
        this.append(bloomBtn = new TextButton("Bloom/Glowing effect: " + (GameConfig.renderBloom? "On" : "Off")).bindEvent(() => {
            GameConfig.renderBloom = !GameConfig.renderBloom;
            bloomBtn.dom.textContent = "Bloom/Glowing effect: " + (GameConfig.renderBloom? "On" : "Off");
        }));
        this.append(bobbingBtn = new TextButton("Bobbing: " + (GameConfig.bobbing? "On" : "Off")).bindEvent(() => {
            GameConfig.bobbing = !GameConfig.bobbing;
            bobbingBtn.dom.textContent = "Bobbing: " + (GameConfig.bobbing? "On" : "Off");
        }));
        this.append(new TextButton("Reset Highscore").bindEvent(() => GameConfig.highScore = 0));
        this.append(new TextButton("Back").bindEvent(() => popScreen()));
    }

}