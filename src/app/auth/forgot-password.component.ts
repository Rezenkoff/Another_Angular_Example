import { Component, Inject, OnDestroy } from '@angular/core';
import { ForgotPassword, SMSRecoverData } from './models';
import { NavigationService } from '../services/navigation.service';
import { AlertService } from '../services/alert.service';
import { LanguageService } from '../services/language.service';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { AuthHttpService } from './auth-http.service';
import { AuthForgotPassTimeService } from '../services/auth-forgot-pass-time.service';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../translate/custom/alert-translation';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { Subscription } from 'rxjs';

@Component({
    selector: 'forgot-password',
    templateUrl: './__mobile__/forgot-password.component.html'
})
export class ForgotPasswordComponent   extends BaseLoader implements OnDestroy  {
    defaulType: string = "email";
    forgotPassword: ForgotPassword = new ForgotPassword("","", this.defaulType);
    smsRecoverData: SMSRecoverData = new SMSRecoverData();
    private timerSub:Subscription; 
    public expires: Date;
    public time:string;
    constructor(
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        public authForgotPass: AuthForgotPassTimeService, 
        private authHttpService: AuthHttpService,
        private navigation: NavigationService,
        private _alertService: AlertService,
        private _languageService: LanguageService
    ) {
        super();
    }
    public ngOnDestroy(): void {
        this.timerSub?.unsubscribe();
    }

    submit() {
        this.StartSpinning();
        let message: string;
        let language = this._languageService.getSelectedLanguage().name;
        this.authHttpService.forgotPassword(this.forgotPassword)
            .subscribe((response:any) => {
                if (response.success) {
                    if (this.forgotPassword.typeRecover === 'email') {
                        message = this._translations.SUCCESS[`reset_info_sent_${language}`] || "Информация для восстановления пароля отправлена на Ваш E-mail";
                        this._alertService.success(message);
                    }
                    else {
                        message = this._translations.SUCCESS[`temporary_password_sent_${language}`] || "Вам отправлено смс с временным паролем!";
                        this._alertService.success(message);
                        this.smsRecoverData.userId = response.data.find(x => x.key == 'userId').value;             
                        const expires = response.data.find(x => x.key == 'expires').value;
                        this.smsRecoverData.codSended = true;

                        this.authForgotPass.setBlockingTime(expires);
                        this.timerSub = this.authForgotPass.countingTime$.subscribe( t => this.time = t);
                    }
                } else {
                    for (let error of response.errors) {
                        message = this._translations.ERRORS[`${error}_${language}`] || this._translations.ERRORS['default'];
                        this._alertService.error(message);
                    }
                }
                this.EndSpinning();
            });
    }

    redirectToResetPassword() {
        this.authHttpService.checkOTPCode(this.smsRecoverData.userId, this.smsRecoverData.confirmCode).subscribe( valid => {
            if(valid) {
                this.navigation.NavigationToResetPassword(this.smsRecoverData.userId);
            } else {
                let language = this._languageService.getSelectedLanguage().name;
                const message = this._translations.ERRORS[`invalid_confirmation_code_${language}`] || "Некорректный код подтверждения!";
                this._alertService.error(message);
            }
        });                
    }
}
