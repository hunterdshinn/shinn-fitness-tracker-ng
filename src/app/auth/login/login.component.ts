import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // loading state
  isLoading = false
  // property to hold subscription to loading state changes
  private loadingSubscription: Subscription

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit() {
    // subscription to loading state changes
    this.loadingSubscription = this.uiService.loadingStateChanged
      .subscribe((isLoading) => {
        // setting the isLoading property 
        this.isLoading = isLoading
      })
  }

  onSubmit(form: NgForm) {
    // calling the login method from our authService --> passing it the log in data
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    })
  }

  ngOnDestroy() {
    // unsubscribe from loading state changes only if the subscription has been initiated
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe()
    }
  }

}
