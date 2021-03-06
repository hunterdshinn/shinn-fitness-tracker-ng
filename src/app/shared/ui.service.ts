import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>()

  constructor(private snackBar: MatSnackBar) {}

  // abstracted snackBar into its own method
  showSnackBar(message, action, duration) {
    this.snackBar.open(message, action, {
      duration: duration
    })
  }
}