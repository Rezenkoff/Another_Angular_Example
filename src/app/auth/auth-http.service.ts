import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserLogin, UserRegistration, CurrentUser, TokenResponse, ResetPassword, ForgotPassword } from './models';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserStorageService } from "../services/user-storage.service";
import { NavigationService } from "../services/navigation.service";
import { APP_CONSTANTS, IAppConstants } from '../config';
import { environment } from "../../environments/environment";
import { ServerParamsTransfer } from '../server-params-transfer.service';

@Injectable()
export class AuthHttpService {
    public userLogedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private storage: UserStorageService,
        protected _http: HttpClient,
        private _navigationService: NavigationService,
        public serverParamsService: ServerParamsTransfer
    ) { }

    public login(obj: UserLogin): Observable<TokenResponse> {
        let body = JSON.stringify(obj);

        return this._http.post<TokenResponse>(environment.apiUrl + this._constants.AUTH.LOGIN_PATH, body).pipe(
           
            map((data) => {
                this.setCurrentUser(data);
                this.userLogedIn.emit(true);
                return data;
            }),
            catchError(
                (error: any) => { return throwError(error) })
        )
    }

    public checkOTPCode(userId: number, code: string) : Observable<boolean> {
        let body = JSON.stringify({code, userId});
        return this._http.post(environment.apiUrl + "account/check/otp", body).pipe( 
            map((response:any) => response         
        ));
    }

    public registration(obj: UserRegistration) {
        let body = JSON.stringify(obj);
        return this._http.post(environment.apiUrl + this._constants.AUTH.ACCOUNT_CREATE_PATH, body).pipe(
            catchError((error: any) => throwError(error)))
    }
   
    public logout() {
        this.storage.clearToken();
        this.userLogedIn.emit(false);
    }

    public setCurrentUser(data: TokenResponse) {
        let user: CurrentUser = this.mapToCurrentUserModel(data);
        this.storage.setUser(user);        
    }
    
    public isAuthenticated(): boolean {
        let user = this.storage.getUser();
        let date = Date.now();

        return user && user.token != null && parseInt(user.expiresIn) > date;
    }

    public isAuthenticatedAndAgreed(): boolean {
        let user = this.storage.getUser();
        return this.isAuthenticated() && user.isOfferAgreed;
    }

    forgotPassword(forgotPassword: ForgotPassword) {
        let body = JSON.stringify(forgotPassword);
        return this._http.post(environment.apiUrl + this._constants.AUTH.FORGOT_PASSWORD, body).pipe(
            catchError((error: any) => throwError(error)))
    }

    resetPassword(model: ResetPassword) {
        let body = JSON.stringify(model);
        return this._http.post(environment.apiUrl + this._constants.AUTH.RESET_PASSWORD, body).pipe(
            catchError((error: any) => throwError(error)))
    }
    
    getCurrentUser() {
        return this.storage.getUser();
    }
    
    setCredentials(data: TokenResponse) {
        if (data.success) {            
            this.setCurrentUser(data);

            if (this.serverParamsService.serverParams.isMobileDevice) {
              
                this._navigationService.NavigateToHome();
                return;
            }
            
            this._navigationService.NavigateToCabinet();
        }
    }

    private getExpiredValue(expiresInSecond: string): string {
        let date = Date.now();
        let expMiliseconds = expiresInSecond + "000";
        date += +expMiliseconds;

        return date.toString();
    }

    public mapToCurrentUserModel(data: TokenResponse): CurrentUser {
        let expIn = this.getExpiredValue(data.expires_in);

        let user: CurrentUser = new CurrentUser(
            data.userData.uid,
            data.userData.phone,
            data.userData.role,
            data.access_token,
            data.userData.email,
            data.userData.firstLastName,
            data.userData.isOfferAgreed,
            expIn,
            data.userData.preferences
        );

        return user;
    }
}