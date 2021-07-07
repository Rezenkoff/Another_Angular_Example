import { Component, Input, Inject, ChangeDetectionStrategy,  ChangeDetectorRef, SimpleChanges, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { QuickOrder } from '../../models/quick-order.model';
import { CartProduct, Cart } from '../models/shoping-cart-product.model';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { BitrixService } from '../../services/bitrix.service';
import { AlertService } from '../../services/alert.service';
import { UserStorageService} from '../../services/user-storage.service';
import { LanguageService } from '../../services/language.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GtagService } from '../../services/gtag.service';
import { AuthHttpService } from '../../auth/auth-http.service';
import { Router } from '@angular/router';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import * as shopingcart from '../actions/shoping-cart';
import * as fromShopingCart from '../reducers';
import { UidParams } from '../../services/uid-params.service';
import { TransactionType } from '../../remarketing/enums/transaction-type';
import { Purchase } from '../../remarketing/purchase';

@Component({
    selector: 'order-popup',
    templateUrl: './__mobile__/order-popup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderPopupComponent extends BaseBlockComponent implements OnInit, OnDestroy 
{
    @Input() selectedProduct: Observable<CartProduct>;
    public cart$: Observable<Cart>;
    public cartProduct: CartProduct;
    private selectedProductSubscription: Subscription = new Subscription();
    public totalCartSum: number;
    public userPhoneNumber: string = '';
    public cart: Cart;
    public inProcess: boolean = false;
    public rtbHouseUrlForBasket: string = "";
    @ViewChild('phone') phoneEl;
    private optionForRemarketingQuickOrder = "quick order";

    constructor(private store: Store<fromShopingCart.State>,
        @Inject(APP_CONSTANTS) public constants: IAppConstants,
        private cd: ChangeDetectorRef,
        private _bitrixService: BitrixService,
        private _alertService: AlertService,
        private _authService: AuthHttpService,
        private _userStorageService: UserStorageService,
        private _gtagService: GtagService,
        private _router: Router,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _languageService: LanguageService,
        private _http: HttpClient,
        private _uidParams: UidParams,
    ) {
        super(constants);

        this.cart$ = store.select(fromShopingCart.getCart);
        this.cart$.subscribe(cart => {
            if (cart.products.length == 0)
                super.hideWindow();

            let basketProductIds = cart ? cart.products.map(x => Math.abs(x.articleId)) : [];
            
            this.cart = cart;
            this.totalCartSum = cart.totalCartSum;
        });

        if (this._authService.isAuthenticated()) {
            let user = this._userStorageService.getUser();
            this.userPhoneNumber = user.phone.replace('+38', '');
        }
    }

    get getImageUrl() {
        return environment.apiUrl + '/productId=' + this.cartProduct.articleId + '&number=1';
    }

    get lookupNumber(): string {
        return this.cartProduct.lookupNumber;
    }

    get quantity(): number {
        return this.cartProduct.quantity;
    }

    set quantity(value: number) {
        this.cartProduct.quantity = value;
    }

    get price(): number {
        return this.cartProduct.price;
    }

    get totalSum(): number {
        return this.cartProduct.price * this.cartProduct.quantity;
    }

    public toggleWindow(): void {
        super.toggleWindow();
        this.cd.detectChanges();

        if (!this.isShowDropDown)
            this.store.dispatch(new shopingcart.SelectProductAction(null));
    }

    public ngOnDestroy() {
        this.selectedProductSubscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.selectedProductSubscription = this.selectedProduct.subscribe(product => {

            this.cartProduct = product;
            this.cd.markForCheck();
        });
    }

    public incrementQuantity(): void {
        this.store.dispatch(new shopingcart.IncrementQuantityAction(this.cartProduct));
    }

    public decrementQuantity(): void {
        this.store.dispatch(new shopingcart.DecrementQuantityAction(this.cartProduct));
    }

    public onQuantityChange(quantity: number) {
        this.store.dispatch(new shopingcart.UpdateQuantityAction({ product: this.cartProduct, quantity: quantity }));
    }

    public isDisabled(): string {
        if (this.quantity == 1)
            return 'disabled-button';

        return '';
    }

    public oneClickOrder(): void {
        let message: string;
        let language = this._languageService.getSelectedLanguage().name;

        if (!this.userPhoneNumber || this.phoneEl.invalid) {
            message = this._translations.SUCCESS[`phone_field_empty_${language}`] || "Введите номер телефона";
            this._alertService.error(message);
            return;
        }
        let transactionId = Purchase.generateUniqueId(TransactionType.QuickOrder);
        let products = this.cart.products;
        let currentUrl = this._router.url;
        let model = new QuickOrder(this.userPhoneNumber, currentUrl, null, products);
        model.transactionId = transactionId;
        this.inProcess = true;
        if (this._authService.isAuthenticated()) {

            this.CreateQuickOrderIfUserIsAutentificated(model, message, language);
        }

        if (!this._authService.isAuthenticated()) {

            this.CreateQuickOrderIfUserIsNotAutentificated(model, message, language);
        }
    }

    public CreateQuickOrderIfUserIsNotAutentificated(model: QuickOrder, message: string, language: string) {

      const params = new HttpParams().set('userPhone', model.userPhoneNumber);

      this._http.get(environment.apiUrl + "crm/uid/getuid", { params: params, responseType: "text" }).subscribe((uidResult: any) => {
            let uid = uidResult;
            this._uidParams.setCurrentUnauthorizeUid(uid);
            this._userStorageService.checkUidParam();
            this._bitrixService.createQuickOrder(model)
                .subscribe(data => {
                    this.sendSuccessAnalytics(data, message, language, model.transactionId);
                });
        });
    }

    public CreateQuickOrderIfUserIsAutentificated(model: QuickOrder, message: string, language: string) {

        this._bitrixService.createQuickOrder(model)
            .subscribe(data => {
                this.sendSuccessAnalytics(data, message, language, model.transactionId);
            });
    }

    public sendSuccessAnalytics(data: any, message: string, language: string, transactionId: string) {

        this.inProcess = false;
        if (data.success) {
            message = this._translations.SUCCESS[`invoise_post_success_${language}`] || "Спасибо, в ближайшее время с вами свяжется наш оператор";
            this._alertService.success(message);
            this.toggleWindow();
            this._gtagService.beginCheckout.sendCheckout(this.optionForRemarketingQuickOrder);
            this._gtagService.progressCheckout.sendCheckoutProgressAfterCartOpen(this.optionForRemarketingQuickOrder);
            this._gtagService.progressCheckout.sendCheckoutProgressAfterUserInfoChange(this.optionForRemarketingQuickOrder);
      
            this._gtagService.purchase.sendPurchaseEventForQuickOrder(transactionId);

        }
        else {
            message = this._translations.ERRORS[`invoise_post_error_${language}`] || "При обработке заказа произошла ошибка";
            this._alertService.error(message);
        }
    }

    public clickCheckout() {
        this.toggleWindow();
        this._router.navigateByUrl("/order-checkout");
        this._gtagService.beginCheckout.sendCheckout(null);
        this._gtagService.progressCheckout.sendCheckoutProgressAfterCartOpen(null);
    }    

    private isCartProductsModified(newProducts: CartProduct[]) {
        let oldProductIds = this.cart ? this.cart.products.map(x => x.articleId) : [];
        let newProductIds = newProducts.map(x => x.articleId);
        if (oldProductIds.length !== newProductIds.length) {
            return true;
        }
        for (let item of oldProductIds) {
            if (!newProductIds.includes(item)) {
                return true;
            }
        }
        return false;
    }
}
