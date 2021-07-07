import { Component, Inject, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { APP_CONSTANTS, IAppConstants } from '../../../config/app-constants';
import { BaseBlockComponent } from '../../abstraction/base-block.component';
import { BitrixService } from '../../../services/bitrix.service';
import { UserStorageService } from '../../../services/user-storage.service';
import { AlertService } from '../../../services/alert.service';
import { LanguageService } from '../../../services/language.service';
import { AuthHttpService } from '../../../auth/auth-http.service';
import { SearchHelpCallback } from './models/search-help-callback.model';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../../translate/custom/alert-translation';


@Component({
    selector: 'search-help-callback',
    templateUrl: './__mobile__/search-help-callback.component.html',
    styleUrls: ['./__mobile__/styles/search-help-callback.component__.scss']
})
export class SearchHelpCallbackComponent extends BaseBlockComponent {

    @ViewChild('phone') phoneEl;
    callback: SearchHelpCallback = new SearchHelpCallback('', '');
    inProcess: boolean = false;

    constructor(
         @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _bitrixService: BitrixService,
        private _authService: AuthHttpService,
       private _userStorageService: UserStorageService,
        private _route: Router,
        private _alertService: AlertService,
        private _languageService: LanguageService
    ) {
        super(_constants);
        if (this._authService.isAuthenticated()) {
            let user = this._userStorageService.getUser();
            this.callback.userPhoneNumber = user.phone.replace('+38', '');
        }
    }

    createCallback() {
        let message: string;
        let language = this._languageService.getSelectedLanguage().name;

        if (!this.callback.userPhoneNumber || this.phoneEl.invalid) {
            message = this._translations.SUCCESS[`phone_field_empty_${language}`] || "Введите номер телефона";
            this._alertService.error(message);
            return;
        }

        this.callback.currentUrl = this._route.url;
        this.inProcess = true;

        this._bitrixService.createCallbackLead(this.callback)
        //change data type
            .subscribe((data:any) => {
                this.inProcess = false;
                if (data.success) {
                    message = this._translations.SUCCESS[`success_callback_${language}`] || "Спасибо, ожидайте звонка менеджера";
                    this._alertService.success(message);
                }
                else
                    this._alertService.error(data.reason);//need translation
                this.toggleWindow();
            });
    }
}
