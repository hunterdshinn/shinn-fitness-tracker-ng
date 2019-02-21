import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // initial available exercises property to be pulled in from the trainingService
  exercises: Exercise[];
  // loading state
  isLoading = true
  // subscription for exercisesChanged subject
  private exerciseSubscription: Subscription;
  // property to hold subscription to the loadingStateChanged
  private loadingSubscription: Subscription

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit() {
    // subscription to loading state changes
    this.loadingSubscription = this.uiService.loadingStateChanged
      .subscribe((isLoading) => {
        // set the loading state
        this.isLoading = isLoading
      })
      
    // getting available exercises from populating event in trainingService
    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe((exercises) => {
        this.exercises = exercises
      })
    this.fetchExercises()
  }

  // method to fetch availale exercises
  fetchExercises() {
    this.trainingService.fetchAvailableExercises()
  }

  onStartTraining(form: NgForm) {
    // passing the selected exercise to our training service
    this.trainingService.startExercise(form.value.exercise)
  }

  ngOnDestroy() {
    // unsubscribing from exercises only if subscription has been initiated
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe()
    }
    
    // unsubscribing from loading state changes only if subscription has been initiated
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe()
    }
  } 
}
