import { Component, OnInit } from '@angular/core';
import { Database, child, ref, set, update } from '@angular/fire/database';
import { Match } from 'src/app/models/match-model';
import { Score } from 'src/app/models/score-model';
import { Team } from 'src/app/models/team-model';
import { Tournament } from 'src/app/models/tournament-model';
import { DataManagementService } from 'src/app/services/data-management.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  tournamentId: string = '';
  teams!: Team[];
  matches: Match[] = [];
  currentMatch!: Match | null;
  isMatchLive: boolean = false;
  showHideScoreCard: boolean = false;
  matchToUpdateScore!: Match;
  matchStatus!: boolean;
  superTeam: Team | undefined;
  level: number = 1;
  nextLevel: number = 0;
  currentMatchScore!: Score;
  yetToPlayMatchesCount: number = 0;
  viewAllMatches: boolean = false;
  tournamentInstance!: Tournament | undefined;


  constructor(private _dataManagementService: DataManagementService,
    private databaseService: DatabaseService,
    private db: Database) { }

  ngOnInit(): void {
    // this.databaseService.getTournamentInstance().subscribe((tournament: Tournament | null) => {
    //   if (tournament) {
    //     this.tournamentId = tournament.TournamentId;
    //     this.teams = tournament.Teams;
    //     this.level = tournament.Level;
    //     //if (tournament.Matches)
    //     this.yetToPlayMatchesCount = tournament.Matches?.filter(m => m.IsMatchOver === false).length;
    //     if (tournament.Matches) {
    //       this.matches = tournament.Matches;

    //       if (tournament.CurrentMatchID) {
    //         this.isMatchLive = true;
    //         this.currentMatch = this.matches.find(m => m.MatchID === tournament.CurrentMatchID) ?? null;
    //       } else {
    //         this.currentMatch = null;
    //       } //tournament.MatchCount > 0 && 
    //     }
    //     if (!tournament.Matches || tournament.MatchGenerationFlag) {
    //       this.generateMatches(this.level);
    //     }
    //   }
    // });

    this.tournamentInstance = this.databaseService.getTournamentInstance();
    if (this.tournamentInstance) {
      this.tournamentId = this.tournamentInstance.TournamentId;
      this.teams = this.tournamentInstance.Teams;
      this.level = this.tournamentInstance.Level;

      this.yetToPlayMatchesCount = this.tournamentInstance?.Matches?.filter(m => m.IsMatchOver === false).length;
      if (this.tournamentInstance.Matches) {
        this.matches = this.tournamentInstance.Matches;

        if (this.tournamentInstance.CurrentMatchID) {
          this.isMatchLive = true;
          this.currentMatch = this.matches.find(m => m.MatchID === this.tournamentInstance?.CurrentMatchID) ?? null;
        } else {
          this.currentMatch = null;
        } //tournament.MatchCount > 0 && 
      }
      if (!this.tournamentInstance.Matches || this.tournamentInstance.MatchGenerationFlag) {
        this.generateMatches(this.level);
      }
    }

  }

  // isFinal(match: Match, ix: number): boolean {
  //   this.yetToPlayTeams
  // }

  showAllMatches() {
    this.viewAllMatches = true;
  }

  isDisabled(m: Match) {
    return this.isMatchLive && m.MatchID !== this.currentMatch?.MatchID;
  }

  yetToPlayTeams() {
    let retval = 0
    if (this.teams) {
      retval = this.teams.filter(t => !t.IsEliminated).length;
    }
    return retval
  }

  activeMatches() {
    return this._dataManagementService.getMatches().filter(m => !m.IsMatchOver).length;
  }

  generateSuperTeam(teams: Team[]) {
    let randIx = (Math.floor(Math.random() * teams.length));
    this.superTeam = teams[randIx];
    this.superTeam.IsSuper = true;
  }

  generateMatches(level: number) {
    let tempTeams: Team[] = [];
    this.teams.forEach((team) => {
      if (!team.IsEliminated)
        tempTeams.push(team);
    });

    if (tempTeams.length % 2 === 1) {
      this.generateSuperTeam(tempTeams);
    } else if (this.superTeam) {
      this.superTeam.IsSuper = false;
      this.superTeam = undefined;
    }

    if (this.superTeam && tempTeams.length > 2) {
      // Removing Super Team from teams list
      tempTeams.splice(tempTeams.indexOf(this.superTeam), 1);
    }

    // Generating Matches
    this.generateFixture(tempTeams, level);

    console.log(this.matches);
    this.saveMatches(this.matches);
    //this._dataManagementService.setMatchGenerationFlag();
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

  // Shuffling Teams
  private ShhuffleTeams(teams: Team[]): Team[] {
    for (let i = teams.length - 1; i > 0; i--) {
      // pick a random index from 0 to i inclusive
      const j = Math.floor(Math.random() * (i + 1)); // at random index
      // Swap arr[i] with the element
      [teams[i], teams[j]] = [teams[j], teams[i]];
    }
    return teams;
  }

  private generateFixture(teams: Team[], level: number) {
    // Shuffling Teams
    teams = this.ShhuffleTeams(teams);

    for (let i = 0; i < teams.length / 2; i++) {
      this.matches.push(
        {
          MatchID: 'M_L_' + (level) + '_' + (i + 1),
          Level: level,
          T1: teams[i],
          T2: teams[teams.length - i - 1],
          Won: '',
          Score: new Score,
          IsMatchOver: false
        }
      );
    }
  }

  saveMatches(matches: Match[]) {
    const updates: any = {}
    updates['/Matches'] = matches;
    updates['/SuperTeamID'] = this.superTeam?.T ?? 0;
    updates['/MatchGenerationFlag'] = false;

    update(ref(this.db, 'tournaments/' + this.tournamentId), updates);
  }

  startMatch(matchId: string) {
    const match: any = this.matches.find(m => m.MatchID === matchId);
    this.currentMatch = match;
    this.isMatchLive = true;
    update(ref(this.db, 'tournaments/' + this.tournamentId), {
      'CurrentMatchID': matchId
    });
  }
  stopMatch() {
    this._dataManagementService.endCurrentMatch();
    this.isMatchLive = this.matchStatus = false;
    this.currentMatch = null;
    update(ref(this.db, 'tournaments/' + this.tournamentId), {
      'CurrentMatchID': null
    });
    //this.databaseService.setCurrentMatch(null);
  }

  onScoreBtnClick(match: Match) {
    this.showHideScoreCard = true;
    this.matchToUpdateScore = match;
    if (match == this.currentMatch && this.isMatchLive) {
      this.matchStatus = true;
    }
  }

  onScoreUpdated(event: { score: Score, status: boolean }) {
    this.showHideScoreCard = false;
    if (event.status) {
      let ix;
      this.matches.find((m, i) => {
        if (m.MatchID === this.currentMatch?.MatchID) {
          ix = i;
          m.Score = event.score;
          if (event.score.Score1 === 15 && this.currentMatch) {
            m.Won = 'T1';
            m.T2.IsEliminated = true;
            m.IsMatchOver = true;
            this.stopMatch();
          } else if (event.score.Score2 === 15 && this.currentMatch) {
            m.Won = 'T2';
            m.T1.IsEliminated = true;
            m.IsMatchOver = true;
            this.stopMatch();
          }
          const updates: any = {}
          updates['/Matches/' + i + '/Score'] = m.Score;
          updates['/Matches/' + i + '/T1/IsEliminated'] = m.T1.IsEliminated;
          updates['/Matches/' + i + '/T2/IsEliminated'] = m.T2.IsEliminated;
          updates['/Matches/' + i + '/Won'] = m.Won;
          updates['/Matches/' + i + '/IsMatchOver'] = m.IsMatchOver;
          updates['/Teams/' + (m.T1.T - 1) + '/IsEliminated'] = m.T1.IsEliminated;
          updates['/Teams/' + (m.T2.T - 1) + '/IsEliminated'] = m.T2.IsEliminated;
          update(ref(this.db, 'tournaments/' + this.tournamentId), updates);
        }
      });
    }
  }

  goToNextLevel() {
    //Clearing Super Team
    // this._dataManagementService.clearSuperTeam();
    // this.superTeam = undefined;
    // this._dataManagementService.resetMatchGenerationFlag();

    // Set level
    if (this.yetToPlayTeams() > 0) {
      this.nextLevel = this.level + 1;
      //this._dataManagementService.setMatchLevel(this.currentLevel+1);
      const updates: any = {}
      updates['/Level'] = this.nextLevel;
      updates['/MatchGenerationFlag'] = true;
      update(ref(this.db, 'tournaments/' + this.tournamentId), updates);
    }
  }
}
