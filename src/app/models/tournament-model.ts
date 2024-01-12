import { Match } from "./match-model";
import { Player } from "./player-mode";
import { Team } from "./team-model";

export class Tournament {
    TournamentId!: string;
    DOT!: string;
    IsTeamsGenerated!: boolean;

    Players!: Player[];
    Teams!: Team[]
    Matches!: Match[];

    Level!: number;
    SuperTeamID!: number;
    CurrentMatchID!: string;
    MatchGenerationFlag!: boolean;

    constructor(){
        this.TournamentId = '';
        this.DOT = '';
        this.IsTeamsGenerated = false;

        this.Players = [];
        this.Teams = [];
        this.Matches = [];

        this.Level = 1;
        this.SuperTeamID = 0;
        this.CurrentMatchID = '';
        this.MatchGenerationFlag = true;
    }
}