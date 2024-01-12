import { Component, OnInit } from '@angular/core';
import { Database, set, ref, update, onValue, push, child, remove, query, equalTo, get } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/player-mode';
import { Team } from 'src/app/models/team-model';
import { Tournament } from 'src/app/models/tournament-model';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  tournamentId: string = '';
  players: Player[] = [];
  //isTeamsGenerated: boolean = false;
  teams: Team[] = [];
  superTeam!: Team | undefined;
  tournamentInstance!:Tournament | undefined;

  readonly T_ID = this.tournamentId = (new Date).toLocaleDateString().toString().replaceAll('/', '');

  constructor(private db: Database,
    private router: Router,
    private _dataManagementService: DataManagementService,
    private databaseService: DatabaseService) { }

  ngOnInit(): void {
    // this.databaseService.getTournamentInstance().subscribe((tournament: Tournament | null) => {
    //   if (tournament) {
    //     this.tournamentId = tournament.TournamentId;
    //     this.players = tournament.Players;

    //     if (tournament.Teams) {
    //       this.teams = tournament.Teams;
    //       if(tournament.SuperTeamID > 0){
    //         this.superTeam = this.teams[this.teams.findIndex(t=>t.T === tournament.SuperTeamID)];
    //       }
    //     } else {
    //       this.generateTeams();
    //     }

    //     // TBD
    //     // this.superTeam = this._dataManagementService.getSuperTeam();
    //   }
    // });

    this.tournamentInstance = this.databaseService.getTournamentInstance();
    if(this.tournamentInstance){
      this.tournamentId = this.tournamentInstance.TournamentId;
      this.players = this.tournamentInstance.Players;
      if(this.tournamentInstance.Teams){
        this.teams = this.tournamentInstance.Teams;
        if(this.tournamentInstance.SuperTeamID > 0){
          this.superTeam = this.teams[this.teams.findIndex(t=>t.T === this.tournamentInstance?.SuperTeamID)];
        }
      } else {
        this.generateTeams();
      }
    }
  }

  generateTeams() {
    if (this.players) {
      this.shuffulPlayers(this.players)
      this.teams = [];
      for (let i = 0; i < this.players.length / 2; i++) {
        this.teams.push(
          {
            P1: this.players[i],
            P2: this.players[this.players.length - i - 1],
            T: i + 1,
            IsSuper: false,
            IsEliminated: false
          }
        ); 
      }
    }
    this.saveTeams();
    //Storing teams to Service
    this._dataManagementService.storeTeams(this.teams);

  }

  // TBD - Saving data to realtime DB
  saveTeams() {
    update(ref(this.db, 'tournaments/' + this.tournamentId), {
      'Teams': this.teams,
      'MatchCount': this.teams.length - 1
    });
  }

  private shuffulPlayers(arr: Player[] | null) {
    if (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        // pick a random index from 0 to i inclusive
        const j = Math.floor(Math.random() * (i + 1)); // at random index
        // Swap arr[i] with the element
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }

  generateMatches() {
    this.router.navigate(['matches']);
  }
}
