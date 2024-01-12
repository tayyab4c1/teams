import { Team } from "./team-model";


export class Score {
    Team1: Team;
    Team2: Team;
    Score1: number = 0;
    Score2: number = 0;

    constructor(){
        this.Team1 = new Team;
        this.Team2 = new Team;
    }
}