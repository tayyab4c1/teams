import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DataManagementService } from './services/data-management.service';
import { Database, onValue, ref } from '@angular/fire/database';
import { Tournament } from './models/tournament-model';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myApp';
  tournamentId!: string;
  tournamentInstance!: Tournament | undefined;
  isMenuActive: boolean = false;

  readonly T_ID = (new Date).toLocaleDateString().toString().replaceAll('/', '');

  constructor(public router: Router,
    private _authService: AuthService,
    private db: Database,
    private _dataManagementService: DataManagementService,
    private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.getTournamentInstanceFromDB();
  }

  getTournamentInstanceFromDB() {
    // onValue(ref(this.db, 'tournaments/' + this.T_ID), (snapshot) => {
    //   if (snapshot.exists()) {
    //     this.tournamentInstance = snapshot.val();

    //     this.databaseService.setTournamentInstance(snapshot.val());

    //     if (this.tournamentInstance && this.tournamentInstance.TournamentId === this.T_ID) {
    //       this.tournamentId = this.tournamentInstance.TournamentId;
    //     } else { this.tournamentId = '- -' }
    //   }
    // });

    this.tournamentInstance = this.databaseService.getTournamentInstance();
    if(this.tournamentInstance){
      this.tournamentId = this.tournamentInstance.TournamentId;
    } else { this.tournamentId = '- -' }
  }

  onMenuClick() {
    this.isMenuActive = !this.isMenuActive;
    // this.isMenuActive ? this.router.navigate(['t-list']) : this.router.navigate(['player-entry']);
  }

  showHideTournamrndId(): boolean {
    let retval = true;
    switch (this.router.url) {
      case '/login':
        retval = false;
        break;
      case '/t-list':
        retval = false;
        break;
    }
    return retval;
  }

  logOut() {
    this._authService.logout();
    // this._dataManagementService.clearUserScession();
    this.databaseService.clearUserScession();
    location.reload();
  }
}
