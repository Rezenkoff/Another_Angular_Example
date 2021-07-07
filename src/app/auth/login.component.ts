import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { UserLogin, TokenResponse } from './models';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { AuthHttpService } from './auth-http.service';
import { AuthErrorService } from './auth-error.service';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { NavigationService } from '../services/navigation.service';
import { AlertService } from '../services/alert.service';
import { UserStorageService } from '../services/user-storage.service';
import { GtagService } from '../services/gtag.service';
import { ActionEvent, GlobalTransportService } from '../services/global-flag.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'auth',
    templateUrl: './__mobile__/login.component.html'
})
export class LoginComponent extends BaseLoader {
    userLogin: UserLogin = new UserLogin("", "");
    public mask = this._constants.PATTERNS.PHONE_MASK;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _authHttpService: AuthHttpService,
        private _authErrorService: AuthErrorService,
        private _navigation: NavigationService,
        private _alertService: AlertService,
        private _gtagService: GtagService,
        private storage: UserStorageService,
        private _transportService: GlobalTransportService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        super();
    }

    public registrationView() {
        this._navigation.NavigateToRegistration();
    }

    public login() {
        this.StartSpinning();

        this._authHttpService.login(this.userLogin).subscribe(
            response => {
                this._authHttpService.setCredentials(response as TokenResponse);
                this.storage.deleteUserIdParam();
                this.storage.checkUidParam();
                this._gtagService.login.sendEventLogin("phone number");
            },
            error => {
                let message = this._authErrorService.getErrorDescription(error);
                this._alertService.error(message);
                this.EndSpinning();
            }
        );
    }

    public forgotPassword() {
        this._navigation.NavigateToForgotPassword();
    }

    onLoginInput(login: string) {
        this.userLogin.phone = login;
        if (this.userLogin.phone.length == 10) {
            document.getElementById("password").focus();
        }
    }

    ngOnDestroy() {
     
        if (isPlatformBrowser(this.platformId) && this._authHttpService.isAuthenticated())
            this._transportService.emitParcel({ typeFlag: ActionEvent.showMainMobileMenu, value: true });
    }
}



