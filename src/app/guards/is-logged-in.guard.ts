import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {
  }

  async canActivate() {
    const isIntroShowed = await this.storage.get('isUserLoggedIn');
    if (isIntroShowed) {
      return true;
    } else {
      this.router.navigate(['/login'])
    }
  }
}
