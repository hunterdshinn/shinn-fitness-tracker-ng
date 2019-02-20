import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  // to pass the selected exercise to whoever is listening 
  exerciseChanged = new Subject<Exercise>()
  // to pass the available exercises to whoever is listening
  exercisesChanged = new Subject<Exercise[]>()
  // to pass the finished exercises to whoever is listening
  finishedExercisesChanged = new Subject<Exercise[]>()
  // exercises available to the user
  private availableExercises: Exercise[] = []
  // property to store the selected exercise 
  private runningExercise: Exercise

  constructor(private db: AngularFirestore){ }

  // method to retrieve the exersices from the db
  fetchAvailableExercises() {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map((docArray) => {
        // converting data to the proper structure
        return docArray.map((doc) => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories']
          } 
        })
      }))
      .subscribe((exercises: Exercise[]) => {
        // populating the availableExercises array off the exercises from the db
        this.availableExercises = exercises
        // triggering the event emitter to pass the exercises after storing them from the db
        this.exercisesChanged.next([...this.availableExercises])
      })
  }

  // method to be called to set the runningExercise property 
  startExercise(selectedId: string) {
    // store the exercise that matches the selected exercise's id in the runningExercise property
    this.runningExercise = this.availableExercises.find((exercise) => exercise.id === selectedId)
    // passing all of the properties of the selected exercise to the exerciseChanged Subject
    this.exerciseChanged.next({ ...this.runningExercise })
  }

  // method to be called when an exercise is completed
  completeExercise() {
    // call the addDataToDatabase method and pass it the exercise object
    this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed'})

    // clear the runningExercise
    this.runningExercise =  null
    // emit that exerciseChanged to null
    this.exerciseChanged.next(null)
  }

  // method to be called when an exercise is canceled, receiving the progress for calculations
  cancelExercise(progress: number) {
    // call the addDataToDatabase method and pass it the exercise with a canceled date, state, duration, and calories
    this.addDataToDatabase({ 
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'canceled'
    })

    // clear the runningExercise
    this.runningExercise =  null
    // emit that exerciseChanged to null
    this.exerciseChanged.next(null)

  }

  // method to get a copy of the runningExercise (selected exercise)
  getRunningExercise() {
    return { ...this.runningExercise }
  }

  // method to fetch finished exercises data from db
  fetchCompletedOrCanceledExercises() {
    this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // emit the finishedExercises from the db
        this.finishedExercisesChanged.next(exercises)
      })
  }

  // method to save data to db
  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise)
  }

}