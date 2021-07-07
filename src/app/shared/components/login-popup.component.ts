import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { AuthHttpService } from '../../auth/auth-http.service';
import { AuthErrorService } from '../../auth/auth-error.service';
import { NavigationService } from '../../services/navigation.service';
import { AlertService } from '../../services/alert.service';
import { TokenResponse } from '../../auth/models/token.model';
import { UserLogin } from '../../auth/models/user-login.model';
import { GtagService } from '../../services/gtag.service';

@Component({
    selector: 'login-popup',
    templateUrl: './__mobile__/login-popup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPopupComponent {    
    userLogin: UserLogin = new UserLogin("", "");
    public mask = this._constants.PATTERNS.PHONE_MASK;
    public inProcess: boolean = false;

    constructor(private _authHttpService: AuthHttpService,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _authErrorService: AuthErrorService,
        private _navigation: NavigationService,
        private _alertService: AlertService,
        private _gtagService: GtagService,
        private dialogRef: MatDialogRef<LoginPopupComponent>)
    {
    }

    public close(result?: boolean): void {
        this.dialogRef.close(result);
    }

    public login() {
        this.inProcess = true;

        this._authHttpService.login(this.userLogin).subscribe(
            response => {
                this.setCredentials(response);
                this._gtagService.login.sendEventLogin("phone number");
                this.inProcess = false;
                this.close(true);
            },
            error => {
                let message = this._authErrorService.getErrorDescription(error);
                this._alertService.error(message);
                this.inProcess = false;
            }
        );
    }

    private setCredentials(data: TokenResponse) {
        if (data.success) {
            this._authHttpService.setCurrentUser(data);
            this.close();
        }
    }

    onLoginInput(login: string) {
        this.userLogin.phone = login;
        if (this.userLogin.phone.length == 10) {
            document.getElementById("password").focus();
        }
    }

    public registrationView() {
        this.close();
        this._navigation.NavigateToRegistration();
    }

    public forgotPassword() {
        this.close();
        this._navigation.NavigateToForgotPassword();
    }
}
