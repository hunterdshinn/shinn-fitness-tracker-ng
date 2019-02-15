import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  // event emitter using Subject for authChanges
  authChange = new Subject<boolean>()
  // stores the current user
  private user: User;

  constructor(private router: Router) {}

  // method to be called when the user signs up --> receiving the sign up data
  registerUser(authData: AuthData) {
    // for now, just initializing the user with the sign up data and a fake userId
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    }
    // perform succesful auth actions
    this.authSuccess()
  }

  // method to be called when the user logs in --> receiving the log in data
  login(authData: AuthData) {
    // for now, just initializing the user with the log in data and a fake userId
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    }
    // perform successful auth actions
    this.authSuccess()
  }

  // method to be called when the user logs out 
  logout() {
    // for now, just sets the user property to null
    this.user = null

    // emit that the auth status has changed to false
    this.authChange.next(false)

    // redirect the user
    this.router.navigate(['/login'])
  }

  // method with abstracted duplicate code for auth success
  authSuccess() {
    // emit that the auth status has changed to true
    this.authChange.next(true)

    // redirect the user
    this.router.navigate(['/training'])
  }

  // method to get the current user data
  getUser() {
    // using spread operator to create a new object with the same properties as the user property
    return { ...this.user }
  }

  // method to see whether or not there is a user
  isAuth() {
    return this.user != null
  }

}