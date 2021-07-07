import { Component, OnInit, Inject } from '@angular/core';
import { ProfileService } from './profile.service';
import { ChangePassword, UserData, InitialUserData } from './models';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../../translate/custom/alert-translation';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { LanguageService } from '../../../services/language.service';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { AlertService } from "../../../services/alert.service";
import { NavigationService } from "../../../services/navigation.service";

@Component({
    selector: 'profile',
    templateUrl: './__mobile__/profile.component.html',
    styleUrls: ['./__mobile__/styles/profile.component__.scss']
})

export class ProfileComponent extends BaseLoader implements OnInit {
    changePasswordModel: ChangePassword = new ChangePassword("", "");
    secondNewPassword: string = "";
    samePassword: boolean = true;
    userData: UserData = new UserData("", "");
    info: InitialUserData = new InitialUserData();

    constructor(
        @Inject(APP_CONSTANTS)
        public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS)
        private _alertTranslations: IAlertTranslations,
        public _navigationService: NavigationService,
        private _languageService: LanguageService,
        private _profileService: ProfileService,
        private _alertService: AlertService      
    ) {
        super();
    }

    ngOnInit() {
        this._profileService.getUserData().subscribe(data => {
            this.info = data;
            this.userData.newName = data.firstLastName;
            this.userData.newEmail = data.email;
        });
    }

    returnToCabinetInfo() {
        this._navigationService.NavigateToMobileInfo();
    }

    changePassword() {
        this.StartSpinning();
        if (this.changePasswordModel.newPassword != this.secondNewPassword) {
            this.EndSpinning();
            this.samePassword = false;   
            return;
        }

        this._profileService.changePassword(this.changePasswordModel)
            .subscribe((data:any) => {
                this.EndSpinning();
                if (data.succeeded) {
                    this.alertSucces("password_changed", "Пароль успешно изменен");
                    this.secondNewPassword = "";
                    this.changePasswordModel = new ChangePassword("", "");
                    this.samePassword = true;
                }                
                else {
                    let message: string;
                    if (data.errors && data.errors[0] && data.errors[0]['description']) {
                        message = data.errors[0]['description'];
                    }
                    this.alertError(message, "Ошибка при изменении пароля");
                }
            });
    }

    public changePersonalData() {
        this.StartSpinning();
        this._profileService.changeUserData(this.userData)
            .subscribe((data:any) => {
                this.EndSpinning();                
                if (data.success) {                    
                    this.alertSucces("user_updated", "Ваши данные изменены");                    
                }
                else {    
                    let message: string;
                    if (data.errors && data.errors[0]) {
                        message = data.errors[0];
                    }
                    if (message === 'update failed') { // ignore tpk update status
                        this.alertSucces("user_updated", "Ваши данные изменены");
                        return;
                    }
                    this.alertError(message, "Ошибка при сохранении данных");
                }
            }            
        );
    }

    alertSucces(message: string, defaultMessage: string) {
        let lang = this.getLanguage();  
        let alert_text = this._alertTranslations.SUCCESS[`${message}_${lang}`] || defaultMessage;
        this._alertService.success(alert_text);        
    }

    alertError(message: string, defaultMessage: string) {
        let lang = this.getLanguage();
        let alert_text = this._alertTranslations.ERRORS[`${message}_${lang}`] || defaultMessage;
        this._alertService.error(alert_text);
    }

    getLanguage(): string {
        let lang = "RUS";
        let language = this._languageService.getSelectedLanguage();
        if (language.name) {
            lang = language.name;
        }
        return lang;
    }
}
