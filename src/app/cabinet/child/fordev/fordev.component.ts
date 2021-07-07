import { Component, OnInit, Inject } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { LanguageService } from '../../../services/language.service';
import { ForDevService } from './fordev.service';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../../translate/custom/alert-translation';

@Component({
    selector: 'fordev',
    templateUrl: './__mobile__/fordev.component.html'
})
export class ForDevComponent implements OnInit {

    public confirmedPassword: string;
    public tokenResponse: string;

    constructor(
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _alertService: AlertService,
        private _fordevService: ForDevService,
        private _languageService: LanguageService) {

    }

    public ngOnInit() {

    }

    public getApiToken() {
        let language = this._languageService.getSelectedLanguage().name;
        let message: string;
        this._fordevService.getApiToken(this.confirmedPassword).subscribe((tokendata:any) => {
            if (tokendata.success) {
                this.tokenResponse = tokendata.access_token;
                message = this._translations.SUCCESS[`token_generated_${language}`] || 'Токен успешно сгенерирован';
                this._alertService.success(message);
            }
            else {
                let errorMsg = `${tokendata.error}  ${tokendata.error_description}`;
                
                this._alertService.error(errorMsg);//need translation
            }
        });
    }

}