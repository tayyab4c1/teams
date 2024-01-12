import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passcode!: string;
  //isError: boolean = false;
  errorMsg: string = ' ';
  constructor(private router:Router,
              private _authService: AuthService) { }

  onLogin() {
    if(this.passcode == 'abc'){
      let user = new User;
      user.UserID='001';
      this._authService.logIn(true,user)
      this.router.navigate(['player-entry']);
    } else if(!this.passcode){
      this.errorMsg = 'Enter passcode';
    }
    else {
      this.errorMsg = 'Wrong Pascode';
    }
  }
}
