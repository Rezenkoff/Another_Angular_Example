import { Component, Inject } from '@angular/core';
import { UserRegistration  } from './models/user-registration.model';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { AuthHttpService } from './auth-http.service';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { NavigationService } from '../services/navigation.service';
import { AlertService } from '../services/alert.service';
import { LanguageService } from '../services/language.service';
import { UserStorageService } from '../services/user-storage.service';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../translate/custom/alert-translation';
import { TokenResponse } from './models/token.model';
import { GtagService } from '../services/gtag.service';

@Component({
    selector: 'registration',
    templateUrl: './__mobile__/registration.component.html'
})
export class RegistrationComponent extends BaseLoader {

    public userRegistration: UserRegistration = new UserRegistration("", "", "", "", "", true);
    public mask = this._constants.PATTERNS.PHONE_MASK;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private storage: UserStorageService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _authHttpService: AuthHttpService,
        private _navigationService: NavigationService,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        private _gtagService: GtagService
    ) {
        super();
    }

    public registration() {
        this.StartSpinning();
        let language = this._languageService.getSelectedLanguage().name;
        let message: string = '';
        if (this.userRegistration.password === this.userRegistration.confirmPassword) {
            this._authHttpService
                .registration(this.userRegistration)
                .subscribe((response :any) => {
                    if (response.success) {                 
                        if (this.userRegistration.email) {
                            message = this._translations.SUCCESS[`password_sent_email_${language}`] || "Спасибо за регистрацию! Пароль был отправлен на Ваш E-mail";
                        }
                        else {
                            message = this._translations.SUCCESS[`password_sent_sms_${language}`] || "Спасибо за регистрацию!";
                        }
                        this._alertService.success(message);
                        let result = new TokenResponse(response.access_token, response.expires_in, response.success, response.userData);
                        this._authHttpService.setCredentials(result);

                        let user = this.storage.getUser();
                        if (user && user.uid) {

                            this.storage.deleteUserIdParam();
                            this.storage.checkUidParam();
                        }
                        
                        this._gtagService.signUp.sendEventSignUp("phone number");
                        return;
                    }
                    if(response.errors.length > 0)
                    {
                        for (let error of response.errors) {
                            if(error.Description == "DuplicateUserName")
                            {
                                message = this._translations.ERRORS[`DuplicateUserName_${language}`];
                                this._alertService.error(message);
                                continue;
                            }
                            message = this._translations.ERRORS[`${error.description}_${language}`] || this._translations.ERRORS['default'];
                            this._alertService.error(message);
                        }
                    }
                    this.EndSpinning();
                });
                return;
        }
            message = this._translations.ERRORS[`passwords_not_match_${language}`] || "Введённые пароли не совпадают";
            this._alertService.error(message);
            this.EndSpinning();      
    }    
}

