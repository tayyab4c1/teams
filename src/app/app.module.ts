import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
// import { AngularFontAwesomeModule } from 'angular-font-awesome/dist/src/angular-font-awesome.module';
import { environment } from 'src/environments/environment';
import { FixtureComponent } from './components/fixture/fixture.component';
import { LoginComponent } from './components/login/login.component';
import { MatchesComponent } from './components/matches/matches.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PlayerEntryComponent } from './components/player-entry/player-entry.component';
import { TeamsComponent } from './components/teams/teams.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { ScoreComponent } from './components/matches/score/score.component';
import { CongratsComponent } from './components/congrats/congrats.component';
import { TournamentListComponent } from './components/tournament-list/tournament-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FixtureComponent,
    PlayerEntryComponent,
    LoginComponent,
    TeamsComponent,
    MatchesComponent,
    PageNotFoundComponent,
    PlayerListComponent,
    ScoreComponent,
    CongratsComponent,
    TournamentListComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    //AngularFontAwesomeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
