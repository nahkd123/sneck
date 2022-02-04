import { Direction, Game, LocalPeer, ObjectBag, Objective, Packets, Player, ProcGen, SpeedRule } from "@nahkd123/sneck-commons";
import { popScreen, sneckFocused, sneckMain } from "../..";
import { TextButton } from "../components/TextButton";
import { FadeScreen } from "./FadeScreen";
import { GameScreen } from "./GameScreen";

export class SingleplayerScreen extends FadeScreen {

    constructor() {
        super("singleplayer");
        this.dom.style.background = ProcGen.gradientBackground(0.1, 0.5);

        let header = document.createElement("h1");
        header.textContent = "Singleplayer";
        let subtext = document.createElement("h2");
        subtext.textContent = "Play sneck alone";

        this.dom.append(
            header,
            subtext
        );

        this.append(new TextButton("Play").bindEvent(() => {
            let peer = new LocalPeer();

            let game = new Game({
                objective: Objective.SCORE,
                initialSpeed: 18,
                speedRule: SpeedRule.LENGTH,
                boardWidth: 10,
                boardHeight: 10
            });
            game.current = 0;

            let player = new Player(game);
            player.id = 0;
            player.name = "Player";
            player.outgoingConnection = peer.server;
            player.bag = new ObjectBag(game.width, game.height);
            player.bag.randomizer = new ProcGen.Random();
            player.bag.serverUpdate();
            game.players.push(player);
            peer.server.player = player;
            peer.server.setNewGame(game, 0);

            player.onEliminate = () => {
                peer.server.sendPacket(<Packets.Packet> {
                    type: "client-event",
                    event: "game-over"
                });
            };

            let screen = new GameScreen(peer.client);
            screen.gamemode = "Singleplayer";

            sneckFocused[0] = screen;
            sneckMain.append(screen);
            game.start();
        }));
        this.append(new TextButton("Back").bindEvent(() => popScreen()));
    }

}