import { Objective } from "./Objective";
import { SpeedRule } from "./SpeedRule";

export interface GameRule {

    objective: Objective;
    speedRule: SpeedRule;
    initialSpeed: number;
    boardWidth: number;
    boardHeight: number;

}