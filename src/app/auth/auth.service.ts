import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  // event emitter using Subject for authChanges
  authChange = new Subject<boolean>()
  // stores whether or not the user is authenticated
  private isAuthenticated = false;

  constructor(
    private router: Router, 
    private angularFireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  // method to listen for authState changes, and perform appropriate actions
  initAuthListener() {
    this.angularFireAuth.authState
      .subscribe((user) => {
        if (user) {
          // set isAuthenticated to true
          this.isAuthenticated = true
          // emit that the auth status has changed to true
          this.authChange.next(true)
          // redirect the user
          this.router.navigate(['/training'])
        } else {
          // cancel subscriptions to db
          this.trainingService.cancelSubscriptions()
          // emit that the auth status has changed to false
          this.authChange.next(false)
          // redirect the user (optionally to login, currently removed so that welcome screen shows initially)
          // this.router.navigate(['/login'])
          // set isAuthenticated to false
          this.isAuthenticated = false
        }
      })
  }

  // method to be called when the user signs up --> receiving the sign up data
  registerUser(authData: AuthData) {
    // set loading state to true
    this.uiService.loadingStateChanged.next(true)
    // create a user off of angularFireAuth
    this.angularFireAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // set loading state to false
        this.uiService.loadingStateChanged.next(false)
      })
      .catch((error) => {
        // set loading state to false
        this.uiService.loadingStateChanged.next(false)
        // snack bar to display an error
        this.uiService.showSnackBar(error.message, null, 3000)
      })
  }

  // method to be called when the user logs in --> receiving the log in data
  login(authData: AuthData) {
    // set loading state to true
    this.uiService.loadingStateChanged.next(true)
    // log a user in off of angularFireAuth
    this.angularFireAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // set loading state to false
        this.uiService.loadingStateChanged.next(false)
      })
      .catch((error) => {
        // set loading state to false
        this.uiService.loadingStateChanged.next(false)
        // snack bar to display an error
        this.uiService.showSnackBar(error.message, null, 3000)
      })
  }

  // method to be called when the user logs out 
  logout() {
    // sign out using angularFire
    this.angularFireAuth.auth.signOut()
  }

  // method to see whether or not there is a user
  isAuth() {
    return this.isAuthenticated
  }

}