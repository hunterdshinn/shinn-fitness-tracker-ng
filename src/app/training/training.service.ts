import { Subject } from 'rxjs/Subject'
import { Exercise } from './exercise.model';

export class TrainingService {
  // to pass the selected exercise to whoever is listening 
  exerciseChanged = new Subject<Exercise>()
  // exercises available to the user
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ]
  // property to store the selected exercise 
  private runningExercise: Exercise
  // property to store all completed or canceled exercises
  private exercises: Exercise[] = []

  // method to return a copy of the availableExercises array (because it is private)
  getAvailableExercises() {
    return this.availableExercises.slice()
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
    // store the running exercise onto the exercises array with a completion date and state
    this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed'})

    // clear the runningExercise
    this.runningExercise =  null
    // emit that exerciseChanged to null
    this.exerciseChanged.next(null)
  }

  // method to be called when an exercise is canceled, receiving the progress for calculations
  cancelExercise(progress: number) {
    // store the running exercise onto the exercises array with a canceled date, state, duration, and calories
    this.exercises.push({ 
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

  // method to get completed / canceled exercises array 
  getCompletedOrCanceledExercises() {
    return this.exercises.slice()
  }

}