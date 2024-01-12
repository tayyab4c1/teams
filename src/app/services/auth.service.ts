import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') == "true";
  }

  logIn(isValid: boolean, user: User) {
    if (isValid) {
      localStorage.setItem('isLoggedIn', "true");
      localStorage.setItem('token', user?.UserID)
    }
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
