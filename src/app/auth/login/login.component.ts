import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    // calling the login method from our authService --> passing it the log in data
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    })
  }

}
