import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'

// dialog modal templated inline to confirm from user to stop training
@Component({
  selector: 'app-stop-training',
  template: `
  <h1 mat-dialog-title>
    Stop {{ passedData.name | lowercase }} exercise?
  </h1>
  <mat-dialog-content fxLayoutAlign="center center">
    <p>You are {{ passedData.progress }}% done.</p>
  </mat-dialog-content>
  <mat-dialog-actions fxLayoutAlign="center center">
    <button mat-button [mat-dialog-close]="true">Yes</button>
    <button mat-button [mat-dialog-close]="false">No</button>
  </mat-dialog-actions>
  `
})
export class StopTrainingComponent {
  // injecting the object with data from current-training component
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}