import { Score } from "./score-model";
import { Team } from "./team-model";

export class Match {
    MatchID: string;
    Level: number;
    T1: Team;
    T2: Team;
    Won?: string;
    Score?: Score;
    IsMatchOver?: boolean;

    constructor() {
        this.MatchID = '';
        this.Level = 0;
        this.T1 = new Team;
        this.T2 = new Team;
        this.Won = '';
        this.Score = new Score;
    }
}