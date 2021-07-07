import { Component, Inject } from "@angular/core";
import { QuickOrderComponent } from "../../../shared/components/quick-order.component";
import { IAppConstants, APP_CONSTANTS } from "../../../config";
import { ALERT_TRANSLATIONS, IAlertTranslations } from "../../../translate/custom/alert-translation";
import { BitrixService } from "../../../services/bitrix.service";
import { UserStorageService } from "../../../services/user-storage.service";
import { AlertService } from "../../../services/alert.service";
import { LanguageService } from "../../../services/language.service";
import { HttpClient } from '@angular/common/http';
import { AuthHttpService } from "../../../auth/auth-http.service";
import { Router } from "@angular/router";
import { GtagService } from "../../../services/gtag.service";
import { Store } from "@ngrx/store";
import * as fromShopingCart from '../../../shoping-cart/reducers';
import { UidParams } from "../../../services/uid-params.service";

@Component({
    selector: 'quick-order-form',
    templateUrl: './__mobile__/quick-order-form.component.html'
})
export class QuickOrderFormComponent extends QuickOrderComponent {
    constructor(
        @Inject(APP_CONSTANTS) public __constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private __translations: IAlertTranslations,
        private __bitrixService: BitrixService,
        private __authService: AuthHttpService,
        private __userStorageService: UserStorageService,
        private __route: Router,
        private __alertService: AlertService,
        private __languageService: LanguageService,
        private __gtagService: GtagService,
        private __store: Store<fromShopingCart.State>,
        private __http: HttpClient,
        private __uidParams: UidParams
    ) {
        super(
            __constants,
            __translations,
            __bitrixService,
            __authService,
            __userStorageService,
            __route,
            __alertService,
            __languageService,
            __gtagService,
            __store,
            __http,
            __uidParams
        );
    }

    public checkoutDisabled(): boolean {
        return this.cart.totalItems == 0 ||
            !this.quickOrder.userPhoneNumber
            || this.inProcess;
    }
}