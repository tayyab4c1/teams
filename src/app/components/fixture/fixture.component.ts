import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Database, set, ref, update, onValue, push, child, remove } from '@angular/fire/database';
import { Player } from 'src/app/models/player-mode';


@Component({
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss']
})
export class FixtureComponent implements OnInit {

  playersCount: number = 0;
  playersNameArray: string[] = [];
  data: any = null;
  teams: any[] = [];
  isTeamsGenerated: boolean = false;
  errorMessage: string | undefined;
  showPlayerForm: boolean = false;
  superTeam: { 1: string; 2: string; 'T': string } | undefined;
  playersArray: Player[] = [];
  tournamentId: string = '';


  fixL1: any[] = [];

  readData: any;

  constructor(private fb: FormBuilder,
    private db: Database) { }

  ngOnInit(): void {
    this.tournamentId = (new Date).toLocaleDateString().toString().replaceAll('/','');
    console.log(this.superTeam);
    onValue(ref(this.db, 'tournaments/tournament28102023'), (snapshot) => {
      let readData = snapshot.val();
      console.log(readData);
  });
  }

  fixForm = this.fb.group({
    players: this.fb.array([
    ])
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
    } else if (this.playersCount === 0) {
      this.errorMessage = 'Enter number of players';
      this.showPlayerForm = false;
    } else if (this.playersCount % 2 !== 0) {
      this.errorMessage = 'Number of players should be Even';
      this.showPlayerForm = false;
    }
  }

  onSubmit() {
    this.data = this.fixForm.value;
    this.fixForm.value.players?.forEach((player, ix) => {
      this.playersArray.push({
        ID: ix + 1,
        Name: player
      });
    })
    console.log(this.fixForm.value.players);
    console.log(this.playersArray);
    //this.inserPlayersToDB();
    this.shuffulPlayers(this.fixForm.value.players ?? null);
  }

  inserPlayersToDB() {
    set(ref(this.db, 'tournaments/tournament' + this.tournamentId), {
      'tournamentID': this.tournamentId,
      'players':this.playersArray
    });
  }

  shuffulPlayers(arr: any[] | null) {
    if (arr && !this.isTeamsGenerated) {
      for (let i = arr.length - 1; i > 0; i--) {
        // pick a random index from 0 to i inclusive
        const j = Math.floor(Math.random() * (i + 1)); // at random index
        // Swap arr[i] with the element
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      this.teams = [];
      for (let i = 0; i < arr.length / 2; i++) {
        this.teams.push({ 1: arr[i], 2: arr[arr.length - i - 1], 'T': i + 1 });
      }
      console.log(this.teams);
      this.isTeamsGenerated = true;
    }
  }

  generateFixture() {
    let tempTeams: { 1: string; 2: string; 'T': string }[] = [];
    this.teams.forEach((team) => {
      tempTeams.push(team);
    });
    if (this.teams.length % 2 === 1) {
      let randIx = (Math.floor(Math.random() * this.teams.length));
      this.superTeam = tempTeams[randIx];
      console.log(this.superTeam);
      tempTeams.splice(randIx, 1);
      for (let i = tempTeams.length - 1; i > 0; i--) {
        // pick a random index from 0 to i inclusive
        const j = Math.floor(Math.random() * (i + 1)); // at random index
        // Swap arr[i] with the element
        [tempTeams[i], tempTeams[j]] = [tempTeams[j], tempTeams[i]];
      }
      for (let i = 0; i < tempTeams.length / 2; i++) {
        this.fixL1.push({ 'T1': tempTeams[i], 'T2': tempTeams[tempTeams.length - i - 1] })
      }
      console.log(this.fixL1);
    } else {
      for (let i = tempTeams.length - 1; i > 0; i--) {
        // pick a random index from 0 to i inclusive
        const j = Math.floor(Math.random() * (i + 1)); // at random index
        // Swap arr[i] with the element
        [tempTeams[i], tempTeams[j]] = [tempTeams[j], tempTeams[i]];
      }
      for (let i = 0; i < tempTeams.length / 2; i++) {
        this.fixL1.push({ 'T1': tempTeams[i], 'T2': tempTeams[tempTeams.length - i - 1] })
      }
    }
    
    /*
    update(ref(this.db, 'tournaments/tournament' + this.tournamentId), {
      'teams': tempTeams
    });
    
    if (this.superTeam) {
      const st = this.superTeam;
      update(ref(this.db, 'tournaments/tournament' + this.tournamentId + '/teams'), {
        st
      });
    }

    update(ref(this.db, 'tournaments/tournament' + this.tournamentId), {
      'matches': this.fixL1
    });

    update(ref(this.db, 'tournaments/tournament' + this.tournamentId+'/matches/1'), {
      'w':'T2'
    });

    */
  }
}
