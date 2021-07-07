import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../auth/auth-http.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private _authHttpService: AuthHttpService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return new Observable<boolean>((observer) => {
            let isAuth = this._authHttpService.isAuthenticated();
            if (isAuth) {
                observer.next(true);
                observer.complete();
            }
            else {
                this.router.navigate(['authentication']);
                observer.next(false);
                observer.complete();
            }
        });
    }
}