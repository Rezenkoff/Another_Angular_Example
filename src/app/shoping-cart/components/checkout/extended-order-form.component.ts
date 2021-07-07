import { Component, OnInit, Inject } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as shopingcart from '../../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../../shoping-cart/reducers';
import { Store } from '@ngrx/store';
import { UserService } from '../../../services/user.service';
import { LanguageService } from '../../../services/language.service';
import { AlertService } from '../../../services/alert.service';
import { OrderService } from '../../../services/order.service';
import { NavigationService } from '../../../services/navigation.service';
import { takeUntil } from 'rxjs/operators';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { UserDeliveryInfo } from '../../../order-user-info/models/user-delivery-info.model';
import { IAlertTranslations, ALERT_TRANSLATIONS } from '../../../translate/custom/alert-translation';
import { CheckoutStepTypesEnum } from '../../models/checkout-step-types.enum';
import { ShopingCartService } from '../../services/shoping-cart.service';
import { LiqpayService } from '../../../payment/liqpay/liqpay.service';
import { OrderCreationModel } from '../../models/order-creation-model.model';
import { MatDialog } from '@angular/material/dialog';
import { CheckAvailability } from '../check-vailability.component';
import { ConfirmOrderPopup } from '../confirm-order-popup.component';
import { GtagService } from '../../../services/gtag.service';
import { ShopingCartModelService } from '../../services/shoping-cart-model.service';
import { PriceChangeGradesEnum } from '../../models/price-change-grades.enum';
import { StepsNamesEnum } from '../../models/steps-names.enum';
import { MainUserInfoModel } from '../../../order-user-info/models/main-user-info.model';
import { TransactionType } from '../../../remarketing/enums/transaction-type';
import { Purchase } from '../../../remarketing/purchase';
import * as orderUserInfo from '../../../order-user-info/actions/order-user-info.actions';
import * as fromOrderUserInfo from '../../../order-user-info/reducer';

@Component({
    selector: 'extended-order-form',
    templateUrl: './__mobile__/extended-order-form.component.html',
})
export class ExtendedOrderFormComponent extends BaseLoader implements OnInit {

    public totalItems: number = 0;
    public orderInfoActive: boolean = true;
    public authActive: boolean = false;
    public isAuthorized$: Observable<boolean> = new Observable<boolean>();
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public language: string = "RUS";
    public checkoutStepType: CheckoutStepTypesEnum = CheckoutStepTypesEnum.None;
    private orderCreation: OrderCreationModel;
    private _userDeliveryInfo: UserDeliveryInfo;
    public enabledStep$: BehaviorSubject<StepsNamesEnum> = new BehaviorSubject<StepsNamesEnum>(StepsNamesEnum.ContactInfo);

  constructor(
        private userStore: Store<fromOrderUserInfo.State>,
        private store: Store<fromShopingCart.State>,
        private _orderModelService: ShopingCartModelService,
        private _userService: UserService,
        private _languageService: LanguageService,
        private _shopingCartService: ShopingCartService,
        private _orderService: OrderService,
        private _liqpayService: LiqpayService,
        private _alertService: AlertService,
        private _navigation: NavigationService,
        private _gtagService: GtagService,
        @Inject(ALERT_TRANSLATIONS) public _translations: IAlertTranslations,
        public dialog: MatDialog,
    ) { super() }

    ngOnInit() {
        this.isAuthorized$ = this.store.select(fromShopingCart.getIsAuthorized);
        let authorized = this._userService.isAuthenticated();
        this.store.dispatch(new shopingcart.SetIsAuthorized(authorized));
        this._userService.userLogedIn.pipe(takeUntil(this.destroy$))
            .subscribe(isAuthorized => this.store.dispatch(new shopingcart.SetIsAuthorized(isAuthorized)));
        this.store.select(fromShopingCart.getTotalItems).pipe(takeUntil(this.destroy$)).subscribe(total => {
            this.totalItems = total
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public applyContactInfo(userInfo: MainUserInfoModel): void {
      this._userDeliveryInfo.clientInfo = {
        FirstLastName: userInfo.name,
        Email: userInfo.email,
        Phone: userInfo.phone,
        IsAgreed: true,
        Comment: '',
        Uid: '',
        TireFittingDate: ''
      };
        let transactionId = Purchase.generateUniqueId(TransactionType.ExtendedOrder);
        this._userDeliveryInfo.promo = '';

        this._orderModelService.setUserDeliveryInfo(this._userDeliveryInfo);

        this._shopingCartService.createCartDeal(transactionId);

        this.enabledStep$.next(StepsNamesEnum.DeliveryInfo);

      this._shopingCartService.sendPurchase$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this._gtagService.purchase.sendPurchaseEvent(transactionId); 
        })
    }

    public enableContactInfo(): void {
        this.enabledStep$.next(StepsNamesEnum.ContactInfo);
    }

    public updateDeliveryInfo(userInfo: UserDeliveryInfo): void {
        this._userDeliveryInfo = userInfo;
        this._orderModelService.setUserDeliveryInfo(userInfo);
    }

    public confirmOrder(): void {
        this.StartSpinning();
        this._userService.updateAgreementStatus(true);
        this.checkoutStepType = CheckoutStepTypesEnum.InvoiceCreation;
        this._shopingCartService.checkoutOrder().subscribe(response => {
            this.checkoutStepType = CheckoutStepTypesEnum.None;
            this.EndSpinning();
          this.orderCreation = response.data;


          let clearFittingDateInfo = '';
          this.userStore.dispatch(new orderUserInfo.SetTireFittingDate(clearFittingDateInfo));

          if (response.success) {
            this._shopingCartService.sendPurchase$.next();
          }

            if (!response.success) {
               
                if (response.errors && response.errors.length > 0) {
                    const successMsg = this._translations.SUCCESS[`order_created_${this.language}`];
                    this._alertService.success(successMsg);
                    this.orderComplete(response.errors[0] === 'order_exist' ? response.data : null);  
                }
                else {
                    let message = '';
                    for (var i = 0; i < response.data.ErrorList.length; i++) {
                        message = this._translations.ERRORS[response.data.ErrorList[i] + `_${this.language}`];
                        this._alertService.success(message);
                    }
                }
                this.orderCompleteWithNull(response.data); 
                return;
            }
            
            this.setupLiqpay(response);
         

            if (this.orderCreation.missingRows && this.orderCreation.missingRows.length) {
                this._shopingCartService.logOutOfStockProducts(this.orderCreation.missingRows);
                this.startFlowWithProductsCountConfirmation(response, this.orderCreation.missingRows);
            }
            else {
                this.checkOrderPriceAndProceed(this.orderCreation);
            }
        });
    }

    public getDisableReason(): string {
        this.language = this._languageService.getSelectedLanguage().name;

        if (!(this._userDeliveryInfo) || !this._userDeliveryInfo.clientInfoValid) {
            return this._translations.ERRORS[`order_contact_info_${this.language}`];
        }
        if (!this._orderModelService.isOrderValid) {
            return this._translations.ERRORS[`order_info_${this.language}`];
        }
        if (this.inProcess) {
            return this._translations.ERRORS[`is_process_${this.language}`];
        }
        if (this.totalItems == 0) {
            return this._translations.ERRORS[`total_item_${this.language}`];
        }

        return '';
    }

    private setupLiqpay(response: any): void {
        this._liqpayService.onCallback.pipe(takeUntil(this.destroy$)).subscribe(data => {
            if (data.paytype == "cash") {
                this.completeOrderWithoutPayment(response.data);
                return;
            }
            this.completeOrderWithPayment(response.data);
        })
        this._liqpayService.onReady.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.EndSpinning();
            this.checkoutStepType = CheckoutStepTypesEnum.None;
        })
    }

    private startFlowWithProductsCountConfirmation(response: any, notAvailableProducts: number[]): void {
        let confirmAvailableDialog = this.dialog.open(CheckAvailability, { data: { data: response, availability: notAvailableProducts, language: this.language } });

        confirmAvailableDialog.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(missingItems => {
            if (!missingItems || !missingItems.accept) {
                return;
            }
            this.removeMissingItemsFromInvoice(missingItems);
        });
    }

    private checkOrderPriceAndProceed(orderCreation: OrderCreationModel) {
        this.removeProductsWithZeroQuantity(orderCreation);

        const priceChange = this._shopingCartService.getPricesComparison(orderCreation.reservedRows);

        switch (priceChange.changeGrade) {

            case PriceChangeGradesEnum.Increase:
                let dialogRef = this.dialog.open(ConfirmOrderPopup, { data: orderCreation.reservedRows });
                dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirm => {
                    if (confirm) {
                        this.proceedToPaymentAndSuccessPage(orderCreation);
                    }
                });
                return;

            case PriceChangeGradesEnum.SlightIncrease:
                const infoMsg = this._translations.MESSAGE[`order_price_changed_${this.language}`];
                this._alertService.info(infoMsg + priceChange.changeValue + " грн");
                break;

            case PriceChangeGradesEnum.Decrease:
                const successMsg = this._translations.SUCCESS[`order_price_changed_${this.language}`];
                this._alertService.success(successMsg + priceChange.changeValue + " грн");
                break;

            case PriceChangeGradesEnum.NoChange:
            default:
                break;
        }

        this.proceedToPaymentAndSuccessPage(orderCreation);
    }

    private removeMissingItemsFromInvoice(missingItems: any): void {
        let articlesToBeUpdated = this.updateOrderModelAndGetChangedProducts(missingItems.data);

        this.orderCreation.paymentType = this._orderModelService.Order.paymentKey;

        this.StartSpinning();
        this._orderService.updateInvoiceProduct(this.orderCreation, articlesToBeUpdated).pipe(takeUntil(this.destroy$)).subscribe((result:any) => {
            this.EndSpinning();
            if (!result.success && result.errors.includes('invoice_shipped')) {
                this._alertService.error(this._translations.ERRORS[`invoice_shipped_${this.language}`]);
                return;
            }
            if (!result.success || !result.data) {
                this._alertService.error(this._translations.ERRORS[`something_wrong_${this.language}`]);
                return;
            }
            this.orderCreation = result.data;
            this.checkOrderPriceAndProceed(this.orderCreation);
        });
    }

    private updateOrderModelAndGetChangedProducts(missingItems: any): Array<string> {
        let articlesList = new Array<string>();
        missingItems.forEach(item => {
            let product = this.orderCreation.reservedRows.find(row => row.ref_Key == item.ref_Key);
            if (product) {
                product.cardId = item.product.cardId;
                articlesList.push(product.ref_Key);
            }
        });

        return articlesList;
    };

    private removeProductsWithZeroQuantity(orderCreation: OrderCreationModel): void {
        let notEmptyRowsList = new Array<any>();
        orderCreation.reservedRows.forEach(r => { if (r.quantity > 0) { notEmptyRowsList.push(r); } });
        orderCreation.reservedRows = notEmptyRowsList;
    }

    private orderComplete(orderCreation: OrderCreationModel): void {
        let email = this._orderModelService.Order.clientInfo.Email ? this._orderModelService.Order.clientInfo.Email : '';
        this._shopingCartService.clearDeal();
        if (orderCreation) {
            orderCreation.link = this._userService.isAuthenticated() ? '' : orderCreation.link;
            this._orderService.sendSmsOrEmail(orderCreation.id);
            this._orderModelService.resetModel();
            this._navigation.NavigateToSuccessOrderCheckout(orderCreation.id, orderCreation.link, email);
        }
    }

    private orderCompleteWithNull(response: any): void {
        this.store.dispatch(new shopingcart.UnloadAction());
        this._shopingCartService.clearDeal();
        if (response.orderId) {
            this._navigation.NavigateToSuccessOrderCheckout(response.orderId, '', '', false);
        }
        else {
            this._navigation.NavigateToWaitingOrderCheckout();
        }
    }

    private completeOrderWithoutPayment(orderCreation: OrderCreationModel): void {
        this.orderComplete(orderCreation);
        this._navigation.NavigateToSuspendedOrderCheckout(orderCreation.id, orderCreation.link);
    }

    private completeOrderWithPayment(orderCreation: OrderCreationModel): void {
        this.orderComplete(orderCreation);
        this._navigation.NavigateToSuccessOrderCheckout(orderCreation.id, orderCreation.link);
    }

    private proceedToPaymentAndSuccessPage(orderCreation: OrderCreationModel) {
        this.store.dispatch(new shopingcart.UpdateQuantityArrayAction(orderCreation.reservedRows));

        if (!orderCreation.reservedRows.length) {
            let message = this._translations.ERRORS[`no_available_products_${this.language}`] || "Выбранных товаров нет в наличии";
            this._alertService.error(message);
            return;
        }
        if (orderCreation.signature && orderCreation.data) {
            this.StartSpinning();
            this.checkoutStepType = CheckoutStepTypesEnum.LiqPayLoad;
            this._liqpayService.initCheckout(orderCreation, this._userDeliveryInfo.clientInfo.Phone);
            return;
        }
        this.orderComplete(orderCreation);
    }
}
