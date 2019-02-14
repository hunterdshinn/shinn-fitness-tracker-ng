import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  // event to send to app component to close the sidenav
  @Output() closeSidenav = new EventEmitter<void>()

  constructor() { }

  ngOnInit() {
  }

  // method to emit event to let app component know to close the sidenav
  onClose() {
    this.closeSidenav.emit()
  }

}
