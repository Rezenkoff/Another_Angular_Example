import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UserStorageService } from "../../services/user-storage.service";
import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../auth/auth-http.service';
import { UserRoles } from "../../auth/models/user-roles.enum";

@Injectable()
export class ManagerGuard implements CanActivate {

    constructor(private storageService: UserStorageService, private router: Router, private _authHttpService: AuthHttpService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this._authHttpService.isAuthenticated() &&
            (this.storageService.getUserRole() == UserRoles.Admin || this.storageService.getUserRole() == UserRoles.Manager)
        ) {
            return true;
        } else {
            this.router.navigate(["/admin"]);
            return false;
        }
    }
}