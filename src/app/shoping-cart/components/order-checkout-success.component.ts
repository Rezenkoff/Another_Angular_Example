import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GtagService } from '../../services/gtag.service';
import { IAppConstants, APP_CONSTANTS } from '../../config';
import { AlertService } from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';
import { UserStorageService } from '../../services/user-storage.service';
import { IAlertTranslations, ALERT_TRANSLATIONS } from '../../translate/custom/alert-translation';
import { ProfileService } from '../../cabinet/child/profile/profile.service';
import { UpdateEmail } from '../../cabinet/child/profile/models';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import { DomSanitizer } from '@angular/platform-browser';
import { Cart } from '../models/shoping-cart-product.model';

@Component({
    selector: 'checkout-success',
    templateUrl: './__mobile__/order-checkout-success.component.html'
})
export class OrderCheckoutSuccessComponent implements OnInit, AfterViewInit {
    orderId: string = '';
    secretLinkCode: string = '';
    isEmailExists: boolean = false;
    email: string = '';
    language: string = "RUS";
    cart: Cart;
    rtbHouseUrlForConfirmOrder: string = "";
    isInvoiceExists: boolean = true;

    constructor(private route: ActivatedRoute, private _gtagService: GtagService,
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        private _alertService: AlertService,
        @Inject(ALERT_TRANSLATIONS) public _translations: IAlertTranslations,
        private _languageService: LanguageService,
        private _profileService: ProfileService,
        private _storage: UserStorageService,
        private store: Store<fromShopingCart.State>
    ) {
        this.orderId = this.route.snapshot.params['orderId'];
        this.secretLinkCode = this.route.snapshot.params['orderSecretLinkCode'];
        this.isEmailExists = this.route.snapshot.params['email'];
        let invoiceStr = this.route.snapshot.queryParams['invoice'];
        this.isInvoiceExists = invoiceStr && invoiceStr === 'true';
        this._gtagService.setPurchaseDataLayer();
    }

    ngOnInit() {
        
    }

    ngAfterViewInit() {
        this.store.dispatch(new shopingcart.UnloadAction());
    }

    public setEmail() {
        this.language = this._languageService.getSelectedLanguage().name;

        let re = new RegExp(this._constants.PATTERNS.EMAIL_PATTERN);
        if (!re.test(this.email)) {
            let message = this._translations.ERRORS[`InvalidEmail_${this.language}`];
            this._alertService.error(message);
            return;
        }

        let user = this._storage.getUser();
        if (!user.phone) {
            let message = this._translations.ERRORS[`phone_number_not_found_for_email_change_${this.language}`];
            this._alertService.error(message);
            return;
        }

        this.isEmailExists = true;
        let message = this._translations.SUCCESS[`default_${this.language}`];
        this._alertService.success(message);

        this._profileService.updateEmailByPhone(new UpdateEmail(this.email, user.phone)).subscribe();
    }

    
}
