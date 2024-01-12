import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Match } from 'src/app/models/match-model';
import { Score } from 'src/app/models/score-model';
import { DataManagementService } from 'src/app/services/data-management.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @Output() scoreUpdated = new EventEmitter<{ score: Score, status: boolean }>();
  @Input() match!: Match;
  @Input() matchStatus!: boolean;

  matchStatusMsg!: string;
  doneBtnLabel: string = 'Update Score';
  endCurrentMatch: boolean = false;

  // score1: number = 0
  // score2: number = 0

  score: Score = new Score;

  constructor(private dataManagementService: DataManagementService,
              private router: Router,) { }

  ngOnInit(): void {
    if (this.match.Score) {
      this.score = this.match.Score;
    }
    if (this.matchStatus) {
      this.matchStatusMsg = 'Match in Progress';
    } else { this.matchStatusMsg = 'Match not yet started'; }

    //this.score = this.dataManagementService.getCurrentMatchScore();
  }

  onScoreUpdated() {
    this.scoreUpdated.emit({ score: this.score, status: true });
    if (this.score) {
      this.dataManagementService.updateCurrentMatchScore(this.score);
    }
    // if (this.dataManagementService.getTeams().filter(t => !t.IsEliminated).length == 1 && this.endCurrentMatch) {
    //   this.router.navigate(['congrats']);
    // }
  }

  OnBlur(team1: number, team2: number) {
    if (this.matchStatus) {
      this.matchStatusMsg = 'Match in Progress';

      if (this.score.Score1 > 0 && this.score.Score1 > this.score.Score2 && this.score.Score1 === 15) {
        this.matchStatusMsg = 'Team - ' + team1 + ' won the match';
        this.doneBtnLabel = 'End Match';
        this.endCurrentMatch = true;
      } else if (this.score.Score2 > 0 && this.score.Score2 > this.score.Score1 && this.score.Score2 === 15) {
        this.matchStatusMsg = 'Team - ' + team2 + ' won the match';
        this.doneBtnLabel = 'End Match';
        this.endCurrentMatch = true;
      }
    } else { this.matchStatusMsg = 'Match not yet started'; }

  }

  closeScoreWindow() {
    this.scoreUpdated.emit({ score: this.score, status: false });
  }
}
