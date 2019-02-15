import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  // event to send to app component to close the sidenav
  @Output() closeSidenav = new EventEmitter<void>()
  // keeping track of the auth status
  isAuth = false;
  // subscription property so I can unsubscribe
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // subscribing to the auth status from our authService
    this.authSubscription = this.authService.authChange.subscribe((authStatus) => {
      this.isAuth = authStatus
    })

  }

  // method to emit event to let app component know to close the sidenav
  onClose() {
    this.closeSidenav.emit()
  }

  // method to fire when the user clicks logout
  onLogout() {
    this.authService.logout()

    // calling the onClose() method as well 
    this.onClose()
  }

  ngOnDestroy() {
    // unsubscribe from the auth status subscription
    this.authSubscription.unsubscribe()
  }

}
