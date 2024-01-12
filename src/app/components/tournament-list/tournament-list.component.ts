import { Component, OnInit } from '@angular/core';
import { Database, update, ref } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament-model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss']
})
export class TournamentListComponent implements OnInit {
tournaments: Tournament[] = [];
tournament!: Tournament;
lbl: string[] = [];

windowScrolled = false;

  constructor(private databaseService: DatabaseService,
              public router: Router,
              private db: Database){}

  ngOnInit(): void {
    // this.databaseService.getAllTournaments().subscribe((tournaments: Tournament[]) => {
    //   if (tournaments) {
    //     //this.tournaments = Object.values(tournaments);
    //     // for (let [key, value] of Object.entries(tournaments)) {
    //     //   this.tournaments.push(value);
    //     // }
    //     this.tournaments = tournaments;
    //   }
    // });

    this.tournaments = this.databaseService.allTournaments;
  }

  scrollToTop(): void {
    // scroll to the top of the body
    return document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  show(t: Tournament){
    this.tournament = t;
  }

  deleteTournament(id: string) {
    if (confirm('Are you sure..?')) {
      const updates: any = {}
      updates['/' + id] = null;
      update(ref(this.db, 'tournaments/'), updates);
      location.reload();
    }
  }

  goToHome(){
    this.router.navigate(['player-entry']);
  }

}
