import { Injectable, Inject } from '@angular/core';
import { Error } from "../models/error.model";
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../translate/custom/alert-translation';
import { LanguageService } from '../services/language.service';

@Injectable()
export class AuthErrorService {

    constructor(
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _languageService: LanguageService) { }

    public getErrorDescription(erroredResponse: any): string {
        let message: string;
    
        let language = this._languageService.getSelectedLanguage();

        if (erroredResponse.error.error_description) {
            message = erroredResponse.error.error_description;
        }  

        message = this._translations.ERRORS[`${message}_${language.name}`];
        return message || this._translations.ERRORS['default'];
    }

    public getErrorDescriptions(responseErrors: string[]): Error[] {
        let errors = new Array<Error>();
        responseErrors.forEach(error =>
            errors.push(new Error(error, this.getErrorDescription(error))));

        return errors;
    }

    public getRegistrationErrorDescription(regErrors: Error[]): Error[] {
        let errors = new Array<Error>();
        regErrors.forEach(error =>
            errors.push(new Error(error.code, this.getErrorDescription(error.code))));

        return errors;
    }
}