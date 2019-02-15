import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // eventEmitter for app component to listen for to toggle the sidenav
  @Output() sidenavToggle = new EventEmitter<void>()
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

  // method to toggle the sidenav to emit event to listen for in app component 
  onToggleSidenav() {
    this.sidenavToggle.emit()
  }

  // method to fire when user clicks log out
  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    // unsubscribe from the auth status subscription
    this.authSubscription.unsubscribe()
  }

}
