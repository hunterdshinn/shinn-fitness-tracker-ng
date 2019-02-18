import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  ongoingTraining = false;
  // property to store the subscription to exerciseChanged Subject from trainingService
  exerciseSubscription: Subscription

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // subscribe to exerciseChanged from trainingService
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe((exercise) => {
      // setting the ongoingTraining property baseed on whether or not there is a selected exercise
      if (exercise) {
        this.ongoingTraining = true
      } else {
        this.ongoingTraining = false
      }
    })
  }

}
