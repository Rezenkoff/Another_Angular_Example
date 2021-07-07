import { Component, Inject } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { AlertService } from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';
import { APP_CONSTANTS, IAppConstants } from "../../config";
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';

@Component({
    selector: 'subscription',
    templateUrl: './__mobile__/subscription.component.html'
})
export class SubscriptionComponent {

     public email: string = "";

    constructor(
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        private _subscriptionService: SubscriptionService,
        private _alertService: AlertService,
        private _languageService: LanguageService
    ) {

    }

     addSubscription(): void {        
        let language = this._languageService.getSelectedLanguage().name;
        let message: string;
        this._subscriptionService.addSubscription(this.email)
            .subscribe((resp:any) => {
                if (resp.success) {
                    message = this._translations.SUCCESS[`subscription_added_${language}`] || "Спасибо за подписку";
                    this._alertService.info(message);
                }
                else {
                    message = this._translations.ERRORS[`subscription_already_exist_${language}`] || "Спасибо, вы уже подписаны на наши новости.";
                    this._alertService.error(message);
                }
            })
     }

    public buttonEnabled(): boolean {
        let re = new RegExp(this._constants.PATTERNS.EMAIL_PATTERN);
        return re.test(this.email);
    }
}
