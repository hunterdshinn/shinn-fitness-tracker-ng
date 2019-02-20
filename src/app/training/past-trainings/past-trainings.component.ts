import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  // columns to be rendered
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  // defining the dataSource 
  dataSource = new MatTableDataSource<Exercise>()
  // property to store finishedExercisesChanged subscription
  private finExChangedSubscription: Subscription;

  // getting access to the matSort directive from the template
  @ViewChild(MatSort) sort: MatSort;
  // getting access to the paginator component from the template
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // subscribe to the finishedExercisesChanged subject
    this.finExChangedSubscription = this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises
      })
    // populate the dataSource
    this.trainingService.fetchCompletedOrCanceledExercises()
  }

  ngAfterViewInit() {
    // conencting the sort configuration from the template to the dataSource
    this.dataSource.sort = this.sort
    // connecting the paginator to the dataSource
    this.dataSource.paginator = this.paginator
  }

  // method for filtering the dataSource
  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  ngOnDestroy() {
    // unsubscribing
    this.finExChangedSubscription.unsubscribe()
  }

}
