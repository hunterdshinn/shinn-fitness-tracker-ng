import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate;
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

    // setting the minimum signup age
    this.maxDate = new Date()
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)

  }

  onSubmit(form: NgForm) {
    // calling the registerUser method from our authService --> passing it the sign up data
    this.authService.registerUser({
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
