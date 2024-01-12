import { Injectable } from '@angular/core';
import { __param } from 'tslib';
import { Player } from '../models/player-mode';
import { Team } from '../models/team-model';
import { Match } from '../models/match-model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Score } from '../models/score-model';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  tournamentId: string = '';
  players: Player[] = [];
  teams: Team[] = [];
  superTeam: Team | undefined;
  matches: Match[] =[];
  currentMatch!: Match | null;
  matchLevel: number = 0;
  matchGenerationFlag : boolean = false;

  private _currentMatch = new BehaviorSubject<Match | null>(new Match);
  private _currentMatch$ = this._currentMatch.asObservable();

  private _matchLevel = new BehaviorSubject<number>(1);
  private _matchLevel$ = this._matchLevel.asObservable(); 

  constructor() { }
  //  **  Tournament  
  getTournamentId() {
    return this.tournamentId = (new Date).toLocaleDateString().toString().replaceAll('/', '');
  }

  //  **  Players **
  storePlaters(players: Player[]) {
    this.players = [];
    players.forEach((player) => {
      this.players.push(player);
    })
  }

  getPlayers() {
    return this.players;
  }

  clearPlayers() {
    this.players = [];
    return this.players;
  }

  //  **  Teams **
  storeTeams(teams: Team[]) {
    this.teams = [];
    teams.forEach((team) => {
      this.teams.push(team);
    })
  }

  getTeams() {
    return this.teams;
  }

  clearTeams() {
    this.teams = [];
    return this.teams;
  }

  setSuperTeam(team: Team) {
    this.superTeam = team;
  }

  getSuperTeam() {
    return this.superTeam;
  }

  clearSuperTeam(){
    this.superTeam = undefined;
  }

  //  ** Matches

  setMatchGenerationFlag(){
    this.matchGenerationFlag = true
  }
  resetMatchGenerationFlag(){
    this.matchGenerationFlag = false;
  }
  getMatchGenerationFlag(){
    return this.matchGenerationFlag;
  }

  setMatchLevel(level: number){
    this.matchLevel = level;
    return this._matchLevel.next(level);
  }

  getMatchLevel(): Observable<number> {
    return this._matchLevel$ ?? 0;
  }

  resetMatchLevel(){
    this.matchLevel = 0;
  }

  saveMatches(matches: Match[]) {
    this.matches = [];
    matches.forEach((match: Match) => {
      this.matches.push(match);
    })
  }

  getMatches() {
    return this.matches;
  }

  clearMatches(){
    this.matches = [];
  }

  setCurrentMatch(match: Match) {
    this.currentMatch = match;
    return this._currentMatch.next(match);
  }

  getCurrentMatch(): Observable<Match | null> {
    return this._currentMatch$ ?? null
  }

  updateCurrentMatch(currentMatch: Match){
    this.matches.find((match)=> {
      if(match.MatchID === currentMatch.MatchID){
        currentMatch.Score = match.Score;
        currentMatch.Won = match.Won;
        currentMatch.IsMatchOver = true;
      }
    })
  }

  endCurrentMatch(){
    return this._currentMatch.next(null);
  }

   //  ** Score
  updateCurrentMatchScore(score: Score){
    if(this.currentMatch?.Score)
    this.currentMatch.Score = score;
  }

  getCurrentMatchScore(): Score {
    let sc = new Score;
    if(this.currentMatch?.Score)
    sc = this.currentMatch?.Score;
    return sc;
  }

  //  ** Clear User Scession **
  clearUserScession(){
    this.clearPlayers();
    this.clearTeams();
    this.clearSuperTeam();
    this.resetMatchLevel();
    this.clearMatches();
    this.endCurrentMatch();
    this.resetMatchGenerationFlag();
  }
}
