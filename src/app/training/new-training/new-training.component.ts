import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // initial available exercises property to be pulled in from the trainingService
  exercises: Exercise[];
  // subscription for exercisesChanged subject
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // getting available exercises from populating event in trainingService
    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe((exercises) => {
        this.exercises = exercises
      })
    this.trainingService.fetchAvailableExercises()
  }

  onStartTraining(form: NgForm) {
    // passing the selected exercise to our training service
    this.trainingService.startExercise(form.value.exercise)
  }

  ngOnDestroy() {
    // unsubscribing 
    this.exerciseSubscription.unsubscribe()
  }
}
