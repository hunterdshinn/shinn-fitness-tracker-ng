import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // eventEmitter for app component to listen for to toggle the sidenav
  @Output() sidenavToggle = new EventEmitter<void>()

  constructor() { }

  ngOnInit() {
  }

  // method to toggle the sidenav to emit event to listen for in app component 
  onToggleSidenav() {
    this.sidenavToggle.emit()
  }

}
