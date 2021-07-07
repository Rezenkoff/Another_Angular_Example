import { Component, Inject, OnDestroy } from '@angular/core';
import { ResetPassword } from './models/reset-password.model';
import { AuthHttpService } from './auth-http.service';
import { ActivatedRoute } from '@angular/router';
import { AuthErrorService } from './auth-error.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../services/navigation.service';
import { AlertService } from '../services/alert.service';
import { LanguageService } from '../services/language.service';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../translate/custom/alert-translation';
import { APP_CONSTANTS, IAppConstants } from '../config';

@Component({
    selector: 'reset-password',
    templateUrl: './__mobile__/reset-password.component.html'
})
export class ResetPasswordComponent extends BaseLoader implements OnDestroy {
    model: ResetPassword = new ResetPassword();
    private querySubscription: Subscription;
    public patterns;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private activatedRoute: ActivatedRoute,
        private authHttpService: AuthHttpService,
        private navigation: NavigationService,
        private authErrorService: AuthErrorService,
        private _alertService: AlertService,
        private _languageService: LanguageService
    ) {
        super();

        this.querySubscription = activatedRoute.queryParams.subscribe(
            (queryParam: any) => {
                this.model.id = queryParam['id'];
            }
        );

        this.patterns = this._constants.PATTERNS;
    }

    changePassword() {
        this.StartSpinning();
        let message: string;
        let language = this._languageService.getSelectedLanguage().name;
        if (this.model.newPassword != this.model.repeatPassword) {
            message = this._translations.ERRORS[`passwords_not_match_${language}`] || "Введённые пароли не совпадают";
            this._alertService.error(message);
            this.EndSpinning();
        } else {
            this.authHttpService.resetPassword(this.model)
                .subscribe((data:any) => {
                    if(data.succeeded){
                        message = this._translations.SUCCESS[`password_changed_${language}`] || "Ваш пароль изменён";
                        this._alertService.success(message);                        
                    } else {
                        for (let error of data.errors) {
                            message = this._translations.ERRORS[`${error.description}_${language}`] || this._translations.ERRORS['default'];
                            this._alertService.error(message);
                        }
                    } 
                    this.navigation.NavigateToLogin();                   
                });
            }
    }

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }
}
