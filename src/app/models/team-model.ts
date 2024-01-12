import { Player } from "./player-mode";

export class Team {
    P1: Player;
    P2: Player;
    T: number;
    IsSuper?: boolean;
    IsEliminated?: boolean;

    constructor() {
        this.P1 = new Player;
        this.P2 = new Player;
        this.T = 0;
        this.IsSuper = false;
        this.IsEliminated = false;
    }
}