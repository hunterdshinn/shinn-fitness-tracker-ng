import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';

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
  // property to store the Firebase subscriptions
  private fbSubs: Subscription[] = []

  constructor(
    private db: AngularFirestore, 
    private angularFireAuth: AngularFireAuth,
    private uiService: UIService
  ){ }

  // method to retrieve the exersices from the db
  fetchAvailableExercises() {
    // set loading state to true
    this.uiService.loadingStateChanged.next(true)

    this.fbSubs.push(
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
        // set loading state to false
        this.uiService.loadingStateChanged.next(false)
        // populating the availableExercises array off the exercises from the db
        this.availableExercises = exercises
        // triggering the event emitter to pass the exercises after storing them from the db
        this.exercisesChanged.next([...this.availableExercises])
      }, (error) => {
        // set loading state to false
        this.uiService.loadingStateChanged.next(false)
        // error message if exercises fail to load 
        this.uiService.showSnackBar('Failed to load exercises, please try again.', null, 3000)
        // set exercisesChanged to null to show a refresh option to user in template
        this.exercisesChanged.next(null)
      }))
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
    this.addDataToDatabase({ 
      ...this.runningExercise, 
      date: new Date(), 
      state: 'completed',
      uid: this.angularFireAuth.auth.currentUser.uid
    })

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
      state: 'canceled',
      uid: this.angularFireAuth.auth.currentUser.uid
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
    // current user's uid
    const loggedInUserId = this.angularFireAuth.auth.currentUser.uid

    this.fbSubs.push(
      this.db.collection('finishedExercises', ref => ref.where('uid', '==', loggedInUserId))
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // emit the finishedExercises from the db
        this.finishedExercisesChanged.next(exercises)
      }))
  }

  // method to cancel all subscriptions to db
  cancelSubscriptions() {
    this.fbSubs.forEach((subscription) => {
      subscription.unsubscribe()
    })
  }

  // method to save data to db
  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise)
  }

}