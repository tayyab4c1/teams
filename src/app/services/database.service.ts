import { Injectable } from '@angular/core';
import { Match } from '../models/match-model';
import { Player } from '../models/player-mode';
import { Team } from '../models/team-model';
import { DataSnapshot, Database, get, object, onValue, ref } from '@angular/fire/database';
import { Tournament } from '../models/tournament-model';
import { BehaviorSubject, Observable, Subject, Unsubscribable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  tournamentId: string = '-';
  players: Player[] | undefined;
  teams: Team[] | undefined;
  superTeam: Team | undefined;
  matches: Match[] = [];
  currentMatch!: Match | null;
  matchLevel: number = 0;
  matchGenerationFlag: boolean = false;
  tournamentInstance!: Tournament | undefined;
  allTournaments: Tournament[] = [];
  tournamentObs!: Observable<DataSnapshot>;

  readonly T_ID = this.tournamentId = (new Date).toLocaleDateString().toString().replaceAll('/', '');
  private readonly TODAY = (new Date).toLocaleDateString();


  constructor(private db: Database) {
    const promise = get(ref(this.db, 'tournaments/'));
    this.tournamentObs = from(promise);
    this.getAllTournaments();
  }

  //  ** Tournament ID generation **
  generateT_ID(): string {
    let today = new Date;
    let d = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    let m = today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth();

    let h = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    let mn = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();

    let dateString = d + '_' + m + '_' + today.getFullYear();
    return dateString;
  }

  //  ** Tournament **

  getAllTournaments(){
    let tournaments: Tournament[] = []
    this.tournamentObs.pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        }
      })
    ).subscribe((tData: Tournament[]) => {
      if (tData) {
        for (let [key, value] of Object.entries((tData))) {
          tournaments.push(value);
          this.allTournaments.push(value);
        }
        this.tournamentInstance =  tournaments.find( t => t.TournamentId === this.generateT_ID());
      }
    });
  }

  getTournamentInstance(): Tournament | undefined{
    if(this.tournamentInstance){
      return this.tournamentInstance;
    } else {
      return this.allTournaments.find(t => t.TournamentId === this.generateT_ID());
    }
  }

  //  ** Players **
  getPlayers(): Player[] | undefined {
    // this.getTournamentInstance().subscribe(tournament => {
    //   if (tournament) {
    //     this.players = tournament.Players;
    //   }
    // });
    this.players = this.getTournamentInstance()?.Players;
    return this.players;
  }

  //  ** Teams **

  getTeams(): Team[] | undefined {
    // this.getTournamentInstance().subscribe(tournament => {
    //   if (tournament) {
    //     this.teams = tournament.Teams;
    //   }
    // });
    this.teams = this.getTournamentInstance()?.Teams;
    return this.teams
  }

  //  ** Matches **


  //  ** Clear User Scession **
  clearUserScession() {
    this.tournamentInstance = undefined;
    this.players = [];
    this.teams = [];
    // this.clearSuperTeam();
    // this.resetMatchLevel();
    this.matches = [];
    // this.endCurrentMatch();
    // this.resetMatchGenerationFlag();
  }
}

