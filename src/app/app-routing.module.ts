import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MatchesComponent } from './components/matches/matches.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PlayerEntryComponent } from './components/player-entry/player-entry.component';
import { TeamsComponent } from './components/teams/teams.component';
import { authGuard } from './guards/auth.guard';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { FixtureComponent } from './components/fixture/fixture.component';
import { CongratsComponent } from './components/congrats/congrats.component';
import { TournamentListComponent } from './components/tournament-list/tournament-list.component';

const routes: Routes = [

  { path:'fix', component:FixtureComponent},
  { path: 'login', component: LoginComponent },
  {
    path: '', canActivate: [authGuard], children: [
      { path: 't-list', component: TournamentListComponent},
      { path: 'player-entry', component: PlayerEntryComponent},
      { path: 'player-list', component: PlayerListComponent},
      { path: 'teams', component: TeamsComponent },
      { path: 'matches', component: MatchesComponent },
      { path: 'congrats', component:CongratsComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page 
    ]
  },
  { path: 'fix', component: FixtureComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
