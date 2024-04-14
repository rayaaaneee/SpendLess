import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this._authService.isAuthenticated()) {
      if (state.url === '/auth') {
        this._router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    } else {
      if (state.url !== '/auth') {
        this._router.navigate(['/auth']);
        return false;
      } else {
        return true;
      }
    }
  }
}
