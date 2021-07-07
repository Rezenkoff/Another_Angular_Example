import { Injectable, Inject } from '@angular/core';
import { URLS_FOR_AUTHENTICATION } from './urls-for-authentication.constants';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { NavigationService } from '../../services/navigation.service';
import { UserStorageService } from '../../services/user-storage.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

    constructor(
        @Inject(URLS_FOR_AUTHENTICATION) 
        private _authenticatedUrlsList,
        private _userStorageService: UserStorageService,
        private _navigationService: NavigationService
        ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(this.CheckCurrentPathForAuthentication(req.url)) {

            if(this.IsUserAuthenticationTokenPresented()){
                let modifiedRequest = req.clone({ setHeaders : this.buildAuthorizationHeader() });

                return next.handle(modifiedRequest).pipe( tap((err:any) => { this.handleUnAuthorizedError(err); }));
            }
        }

        return next.handle(req).pipe( tap((err:any) => { this.handleUnAuthorizedError(err); }));
    }
    
    private handleUnAuthorizedError(err:any) {
        if(err instanceof HttpErrorResponse){
            if(err.status !== 401){
                return;
            }
     
        this._navigationService.NavigateToLogin();
        }
    }    

    private CheckCurrentPathForAuthentication(requestUrl: string) : Boolean {
        return this._authenticatedUrlsList.includes(requestUrl);
    }

    private buildAuthorizationHeader() {
        return { "Authorization" : `Bearer ${this._userStorageService.getUserToken()}` };
    }

    private IsUserAuthenticationTokenPresented() : Boolean{
        return this._userStorageService.getUserToken() != null;
    }
}