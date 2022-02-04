import { Direction } from "..";
import { GameRule } from "../base/GameRule";
import { Object } from "../base/Object";
import { Objective } from "../base/Objective";

export namespace Packets {

    /**
     * Clock info packet (Clientbound)
     * 
     * The client will use the server's clock for local game logic
     */
    export type ClockInfo = {
        type: "clock-info",
        tick: number
    }

    /**
     * Client move packet (Serverbound)
     * 
     * The "atTick" value is the server clock tick
     */
    export type ClientMove = {
        type: "client-move",
        atTick: number,
        direction: Direction,
        hold: boolean,
    }

    /**
     * Player update packet (Clientbound)
     * 
     * The server will send player's state to update player's playfield. Usually send
     * every tick
     */
    export type PlayerUpdate = {
        type: "player-update",
        tick: number,
        id: number,
        name: string,
        eliminated: boolean,
        lastInput: Direction,
        hold: boolean,
        snakeTail: [number, number],
        snakeSegments: number[],
        score: number,
        objects: [number, number, number],
        eatables: Object[],
        hasGoOver: boolean,
    }

    /**
     * Auth request (Serverbound)
     */
    export type AuthRequest = {
        type: "auth-request",
        username: string,
        password?: string,
        token?: string
    }

    /**
     * Auth update (Clientbound)
     * 
     * Send when authorization is succeed
     */
    export type AuthUpdate = {
        type: "auth-update",
        success: boolean,
        name?: string
    }

    /**
     * New game (Clientbound)
     * 
     * If the selfId is -1, the player will put in sepectator mode
     */
    export type NewGame = {
        type: "new-game",
        rule: GameRule,
        selfId: number,
    }

    /**
     * Client event (Clientbound)
     * 
     * Send client event to client (Eg: play countdown animation)
     */
    export type ClientEvent = {
        type: "client-event",
        event: "countdown" | "eliminate" | "game-over",

        /** 0 = the game starts */
        countdown?: number,
        playerId?: number,
    }

    export type Packet = 
        | ClockInfo | ClientMove | PlayerUpdate | AuthRequest | NewGame | ClientEvent;

}