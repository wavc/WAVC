import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.cookieService.check(".AspNetCore.Identity.Application"))
      return true;
    this.router.navigateByUrl("/sign-in");
    return false;
  }

}
