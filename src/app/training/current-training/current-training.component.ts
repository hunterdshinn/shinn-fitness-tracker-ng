import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

// import for our dialog modal component
import { StopTrainingComponent } from './stop-training.component'
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  // initial current training progress
  progress = 0;
  // property to store interval 
  timer;
  name = '';

  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit() {
    // timer initialization
    this.startOrResumeTimer()

    this.name = this.trainingService.getRunningExercise().name
  }

  // method to start or resume timer
  startOrResumeTimer() {
    // getting the duration of the selected exercise
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000

    // interval for increasing the current training progress
    this.timer = setInterval(() => {
      this.progress = this.progress + 1

      // stopping the interval once progress reaches 100%
      if (this.progress >= 100) {
        // call method for completion
        this.trainingService.completeExercise()
        clearInterval(this.timer)
      }
    }, step)
  }

  // method for stop button click
  onStop() {
    clearInterval(this.timer)

    // dialog modal to confirm from user -- passing in our dialog modal component and config object for data
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
        name: this.name
      }
    })

    // using afterClosed method to do something when the modal is closed
    dialogRef.afterClosed().subscribe((result) => {
      // the result is the boolean being passed from which button is pressed in the modal
      if (result) {
        // call method for cancellation
        this.trainingService.cancelExercise(this.progress)
      } else {
        this.startOrResumeTimer()
      }
    })

  }

}
