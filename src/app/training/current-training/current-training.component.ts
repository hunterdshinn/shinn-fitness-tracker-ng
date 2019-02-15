import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

// import for our dialog modal component
import { StopTrainingComponent } from './stop-training.component'

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  // event emitter to exit training after user confirmation via modal
  @Output() trainingExit = new EventEmitter()
  // initial current training progress
  progress = 0;
  // property to store interval 
  timer;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    // timer initialization
    this.startOrResumeTimer()
  }

  // method to start or resume timer
  startOrResumeTimer() {
    // interval for increasing the current training progress
    this.timer = setInterval(() => {
      this.progress = this.progress + 5

      // stopping the interval once progress reaches 100%
      if (this.progress >= 100) {
        clearInterval(this.timer)
      }
    }, 1000)
  }

  // method for stop button click
  onStop() {
    clearInterval(this.timer)

    // dialog modal to confirm from user -- passing in our dialog modal component and config object for data
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    })

    // using afterClosed method to do something when the modal is closed
    dialogRef.afterClosed().subscribe((result) => {
      // the result is the boolean being passed from which button is pressed in the modal
      if (result) {
        this.trainingExit.emit()
      } else {
        this.startOrResumeTimer()
      }
    })

  }

}
