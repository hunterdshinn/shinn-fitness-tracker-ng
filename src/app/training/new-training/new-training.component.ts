import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // event emitter for when a new training session starts
  @Output() trainingStart = new EventEmitter<void>()

  constructor() { }

  ngOnInit() {
  }

  // method that emits when a new training session has started
  onStartTraining() {
    this.trainingStart.emit()
  }

}
