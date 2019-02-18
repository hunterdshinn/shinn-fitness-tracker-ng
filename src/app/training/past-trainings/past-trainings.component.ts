import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  // columns to be rendered
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  // defining the dataSource 
  dataSource = new MatTableDataSource<Exercise>()

  // getting access to the matSort directive from the template
  @ViewChild(MatSort) sort: MatSort;
  // getting access to the paginator component from the template
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // populate the dataSource
    this.dataSource.data = this.trainingService.getCompletedOrCanceledExercises()
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

}
