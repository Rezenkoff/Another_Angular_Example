import { Component, Inject, ViewChild } from '@angular/core';
import { QuickOrder } from '../../models/quick-order.model';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { Router } from "@angular/router";
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import { BitrixService } from '../../services/bitrix.service';
import { UserStorageService } from '../../services/user-storage.service';
import { AlertService} from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GtagService } from '../../services/gtag.service';
import { AuthHttpService } from '../../auth/auth-http.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { Subscription, Observable } from 'rxjs';
import { Cart } from '../../shoping-cart/models/shoping-cart-product.model';
import { UidParams } from '../../services/uid-params.service';
import { TransactionType } from '../../remarketing/enums/transaction-type';
import { Purchase } from '../../remarketing/purchase';

@Component({
    selector: 'quick-order',
    templateUrl: './__mobile__/quick-order.component.html',
    styleUrls: ['./__mobile__/styles/quick-order.component__.scss']
})
export class QuickOrderComponent extends BaseBlockComponent {
    @ViewChild('phone') phoneEl;
    quickOrder: QuickOrder = new QuickOrder('', '', []);
    inProcess: boolean = false;

    public cart: Cart;
    private cart$: Observable<Cart>;
    private cartSubscruption: Subscription;
    private optionForRemarketingQuickOrder = "quick order";
    private optionForRemarketingShoppingCart = "extended order";

    public isOrderProcessed: boolean = false;

    constructor(
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _bitrixService: BitrixService,
        private _authService: AuthHttpService,
        private _userStorageService: UserStorageService,
        private _route: Router,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        private _gtagService: GtagService,
        private store: Store<fromShopingCart.State>,
        private _http: HttpClient,
        private _uidParams: UidParams
    ) {
        super(_constants);
        if (this._authService.isAuthenticated()) {
            let user = this._userStorageService.getUser();
            this.quickOrder.userPhoneNumber = user.phone.replace('+38', '');
        }

        this.cart$ = this.store.select(fromShopingCart.getCart);

        this.cartSubscruption = this.cart$.subscribe(cart => {
            this.cart = cart;
        })
    }

    createQuickOrder() {
        let message: string;
        let language = this._languageService.getSelectedLanguage().name;

        if (!this.quickOrder.userPhoneNumber || this.phoneEl.invalid) {
            message = this._translations.SUCCESS[`phone_field_empty_${language}`] || "Введите номер телефона";
            this._alertService.error(message);
            return;
        }

        let transactionId = Purchase.generateUniqueId(TransactionType.QuickOrder);
        this.quickOrder.transactionId = transactionId;
        this.quickOrder.currentUrl = this._route.url;
        this.quickOrder.cartProducts = this.cart.products;
        this.inProcess = true;

        if (!this._authService.isAuthenticated()) {

            this.CreateQuickOrderIfUserIsNotAutentificated(this.quickOrder, message, language);
        }

        if (this._authService.isAuthenticated()) {

            this.CreateQuickOrderIfUserIsAutentificated(this.quickOrder, message, language);
        }
    }

    public CreateQuickOrderIfUserIsNotAutentificated(model: QuickOrder, message: string, language: string) {

        const params = new HttpParams().set('userPhone', model.userPhoneNumber);

      this._http.get(environment.apiUrl + "crm/uid/getuid", { params: params, responseType: "text" }).subscribe((uidResult: any) => {

            //change response type to text
            let uid = uidResult;
            this._uidParams.setCurrentUnauthorizeUid(uid);
            this._userStorageService.checkUidParam();
            this._bitrixService.createQuickOrder(model)
                .subscribe((data) => {
                    this.sendSuccessAnalytics(data, message, language, this.quickOrder.transactionId);
                });
        });
    }

    public CreateQuickOrderIfUserIsAutentificated(model: QuickOrder, message: string, language: string) {

        this._bitrixService.createQuickOrder(model)
            .subscribe((data) => {
                this.sendSuccessAnalytics(data, message, language, this.quickOrder.transactionId);
            });
    }

    public sendSuccessAnalytics(data: any, message: string, language: string, transactionId: string) {

        this.inProcess = false;
        if (data.success) {
            message = this._translations.SUCCESS[`success_callback_${language}`] || "Спасибо, ожидайте звонка менеджера";
            this._alertService.success(message);
            this._gtagService.beginCheckout.sendCheckout(this.optionForRemarketingQuickOrder);
            this._gtagService.progressCheckout.sendCheckoutProgressAfterCartOpen(this.optionForRemarketingQuickOrder);
            this._gtagService.progressCheckout.sendCheckoutProgressAfterUserInfoChange(this.optionForRemarketingQuickOrder);
            this._gtagService.purchase.sendPurchaseEventForQuickOrder(transactionId);
            this.isOrderProcessed = true;
        }
        else
            this._alertService.error("При обработке заказа произошла ошибка");//need translation
        this.toggleWindow();
    }
}
