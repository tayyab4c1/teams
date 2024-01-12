import { Component, OnInit } from '@angular/core';
import { Database, ref, update } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/player-mode';
import { Tournament } from 'src/app/models/tournament-model';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

  players: Player[] = [];
  enableAddPlayer: boolean = false;
  newPlayer: string = '';
  tournamentId!: string;
  tournamentInstance!: Tournament | undefined;

  constructor(
    private _dataManagementService: DataManagementService,
    private router: Router,
    private db: Database,
    private databaseService: DatabaseService) { }

  ngOnInit(): void {
    // this.databaseService.getTournamentInstance().subscribe((tournament: Tournament | null) => {
    //   if (tournament) {
    //     this.tournamentId = tournament.TournamentId;
    //     this.players = tournament.Players;
    //     this.players.sort((a, b) => a.ID - b.ID);
    //   }
    // });
    this.tournamentInstance = this.databaseService.getTournamentInstance();
    if (this.tournamentInstance) {
      this.tournamentId = this.tournamentInstance.TournamentId;
      this.players = this.tournamentInstance.Players;
      this.players.sort((a, b) => a.ID - b.ID);
    }
  }

  addPlayer() {
    this.enableAddPlayer = true
  }

  onAddPlayerInputBlur() {
    this.enableAddPlayer = false;
    let lastID: number = -2;
    if (this.players.at(-1)?.ID) {
      lastID = this.players.at(-1)?.ID ?? -2;
    }

    let player: Player = {
      ID: lastID === -2 ? 1 : lastID + 1,
      Name: this.newPlayer
    }

    if (this.newPlayer) {
      this.players.push(player);
      this.newPlayer = '';
      this.saveNewPlayer();
    }
  }

  saveNewPlayer() {
    const updates: any = {}
    updates['/Players'] = this.players;

    update(ref(this.db, 'tournaments/' + this.tournamentId), updates);
  }

  deletePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
    this.saveNewPlayer();
  }

  generateTeams() {
    this.router.navigate(['teams']);
  }
}

