import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // reaching out to our authService to see if the user is authenticated or not via the isAuth method
    if (this.authService.isAuth()) {
      return true
    } else {
      // if isAuth doesn't resolve to true -- redirect the user
      this.router.navigate(['/login'])
    }
  }

  canLoad(route: Route) {
    // reaching out to our authService to see if the user is authenticated or not via the isAuth method
    if (this.authService.isAuth()) {
      return true
    } else {
      // if isAuth doesn't resolve to true -- redirect the user
      this.router.navigate(['/login'])
    }
  }
}