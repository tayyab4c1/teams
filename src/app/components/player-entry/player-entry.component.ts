import { Component, OnInit } from '@angular/core';
import { Database, set, ref, update, onValue, push, child, remove, get } from '@angular/fire/database';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/player-mode';
import { Tournament } from 'src/app/models/tournament-model';
import { AuthService } from 'src/app/services/auth.service';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-player-entry',
  templateUrl: './player-entry.component.html',
  styleUrls: ['./player-entry.component.scss']
})
export class PlayerEntryComponent implements OnInit {

  playersCount: number = 0;
  errorMessage: string | undefined;
  showPlayerForm: boolean = false;
  playersArray: Player[] = [];
  tournamentId: string = '';
  isTournamentStarted: boolean = false;
  tournamentInstance!: Tournament | undefined;
  //loading: boolean = false;

  readDatafromDB: any;

  // readonly T_ID = (new Date).toLocaleDateString().toString().replaceAll('/', '');
  // readonly T_ID_UNL = (new Date).toLocaleString().replaceAll(' ', '')
  //                                                .replaceAll('/','')
  //                                                .replaceAll(',','')
  //                                                .replaceAll(':','');

  constructor(private fb: FormBuilder,
              private db: Database,
              private router:Router,
              private _dataManagementService: DataManagementService,
              private _authService: AuthService,
              private databaseService: DatabaseService) { 
              }

  ngOnInit(): void {
    // this.databaseService.getTournamentInstance().subscribe((t: Tournament | null) => {
    //   if (t && t.TournamentId === this.databaseService.generateT_ID()) {
    //     this.isTournamentStarted = true;
    //   } else {
    //     this.isTournamentStarted = false;
    //   }
    // });

    this.tournamentInstance = this.databaseService.getTournamentInstance();
    if (this.tournamentInstance && this.tournamentInstance.TournamentId === this.databaseService.generateT_ID()) {
      this.isTournamentStarted = true;
    } else {
      this.isTournamentStarted = false;
    }
  }

  

  /*
  getTournamentInstance(): Tournament | null {
    get(ref(this.db, 'tournaments/' + this.T_ID)).then((snapshot) => {
      if (snapshot.exists()) {
        let data: Tournament = snapshot.val();
        if (data.TournamentId === this.T_ID) {
          this.tournamentInstance = data ?? null;

          if (this.tournamentInstance.TournamentId === this.T_ID) {
            this.isTournamentStarted = true;
            //this.loading = false;
          } else {
            this.isTournamentStarted = false;
            //this.loading = false;
          }
          this.databaseService.setTournamentInstance(this.tournamentInstance);
        }
      } else {
        console.log("No data available");
        //this.loading = false;
      }
    }).catch((error) => {
      console.error(error);
    });
    return this.tournamentInstance;
  } */

  logOut(){
    this._authService.logout();
  }
  
  fixForm = this.fb.group({
    players: this.fb.array([])
  });

  get players() {
    return this.fixForm.get('players') as FormArray;
  }

  generatePlayersArray() {
    this.players.clear();
    if (this.playersCount > 0 && this.playersCount % 2 === 0) {
      for (let i = 1; i <= this.playersCount; i++) {
        this.players.push(this.fb.control(''));
      }
      this.errorMessage = undefined;
      this.showPlayerForm = true;
    } 
    // else if (this.playersCount === 0) {
    //   this.errorMessage = 'Enter number of players';
    //   this.showPlayerForm = false;
    // } 
    else if (this.playersCount % 2 !== 0) {
      this.errorMessage = 'Number of players should be Even';
      this.showPlayerForm = false;
    }
  }

  onSubmit() {
    this.fixForm.value.players?.forEach((player, ix) => {
      this.playersArray.push({
        ID: ix + 1,
        Name: player
      });
    })
    console.log(this.fixForm.value.players);
    console.log(this.playersArray);
    this.inserBasicTournamentToDB();  
    this._dataManagementService.storePlaters(this.playersArray);
    this.router.navigate(['player-list']);
  }

  inserBasicTournamentToDB() {
    let tournament: Tournament = new Tournament();
    tournament.TournamentId = this.databaseService.generateT_ID();
    tournament.DOT = (new Date).toLocaleDateString();
    tournament.IsTeamsGenerated = false;
    tournament.Level = 1;
    tournament.Players = this.playersArray;
    tournament.CurrentMatchID = '';
    tournament.SuperTeamID = 0;
    tournament.MatchGenerationFlag = true;
    set(ref(this.db, 'tournaments/' + tournament.TournamentId), tournament);
  }

  gotoPlayersList(){
    this.router.navigate(['player-list']);
  }
}
