import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // initial available exercises property to be pulled in from the trainingService
  exercises: Exercise[] = []

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // setting the exercises property off of a copy of the available exercises from the trainingService
    this.exercises = this.trainingService.getAvailableExercises()
  }

  onStartTraining(form: NgForm) {
    // passing the selected exercise to our training service
    this.trainingService.startExercise(form.value.exercise)
  }

}
