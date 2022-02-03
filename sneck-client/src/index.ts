import { Component } from "./base/Component";
import { Document } from "./base/Document";
import { HomeScreen } from "./frontend/screens/HomeScreen";
import { GameAudio } from "./GameAudio";

// Loading
// We load the game assets with Promise.all for faster loading speed :)
Promise.all([
    GameAudio.loadAllSamples()
]);

export const sneckMain = new Document();
sneckMain.append(new HomeScreen());

export let sneckFocused: [Component] = [null];

export function popScreen() {
    let children = document.body.querySelectorAll("div.screen") as NodeListOf<HTMLDivElement>;
    if (children.length == 1) return;
    let lastChild = children[children.length - 1];
    lastChild.classList.remove("show");
    GameAudio.playSample("./assets/back.wav", GameAudio.SFX);
    setTimeout(() => {
        lastChild.remove();
    }, 500);
}

export function popAllScreen() {
    let children = document.body.querySelectorAll("div.screen") as NodeListOf<HTMLDivElement>;
    for (let i = 1; i < children.length; i++) children.item(i).remove();
}

// Keyboard handling
document.addEventListener("keydown", event => {
    console.log(event.code);

    if (sneckFocused[0]) {
        sneckFocused[0].handleKeyUnderlying(event);
        return;
    }
    if (event.code == "Escape") popScreen();
});
document.addEventListener("keyup", event => {
    if (sneckFocused[0]) {
        sneckFocused[0].handleKeyUnderlying(event);
        return;
    }
});
