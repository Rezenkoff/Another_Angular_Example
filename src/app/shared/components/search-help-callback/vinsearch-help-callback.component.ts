import { Component, Inject, ViewChild, Input } from '@angular/core';
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
import { CallbackVin } from '../../../find-by-auto/child/models/callback-vin';

@Component({
    selector: 'vinsearch-help-callback',
    templateUrl: './__mobile__/search-help-callback.component.html'
})
export class VinSearchHelpCallbackComponent extends BaseBlockComponent {

    @Input() vin: string;
    @Input() vinFound: boolean = false;

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

        let callbackVin: CallbackVin = {
            currentUrl: this._route.url,
            vin: this.vin,
            vinFound: this.vinFound,
            userPhoneNumber: this.callback.userPhoneNumber,
            refId: null,
            clientId: null,
            utmFields: null
        };

        this.inProcess = true;

        this._bitrixService.createVinSearchCallback(callbackVin)
            .subscribe((resp:any) => {
                this.inProcess = false;
                if (resp.success) {
                    message = this._translations.SUCCESS[`success_callback_${language}`];
                    this._alertService.success(message);
                }
                else {
                    this._alertService.error('Извините, проблемы на сервере.');
                }
            })
    }
}
