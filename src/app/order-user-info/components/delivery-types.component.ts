import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { ShipmentType } from "../../order-step/models";
import { DeliveryMethodsService } from '../services/delivery-method.service';
import { LanguageService } from "../../services/language.service";
import { takeUntil, distinctUntilChanged } from "rxjs/operators";
import * as defaultPrefs from '../../config/default-user-preferences';
import { Cart } from "../../shoping-cart/models/shoping-cart-product.model";
import { Store } from "@ngrx/store";
import * as fromShopingCart from '../../shoping-cart/reducers';

@Component({
    selector: 'delivery-types',
    templateUrl: './__mobile__/delivery-types.component.html'
})
export class DeliveryTypesComponent implements OnInit {

    @Input() shipmentKey$: BehaviorSubject<number> = new BehaviorSubject<number>(defaultPrefs.defaultDeliveryMethodKey);
    @Input() paymentKey$: Observable<number> = new Observable<number>();
    @Input() pointsCount$: Observable<number> = new Observable<number>();
    @Output() onDeliveryTypeSelect: EventEmitter<ShipmentType> = new EventEmitter<ShipmentType>();
    @Input() paymentMethodId$: Observable<number> = new Observable<number>();

    public deliveryMethods: ShipmentType[] = [];
    public selectedDelivery: ShipmentType;
    public pointsCount = null;
    public cart$: Observable<Cart>;

    private shipmentKey: number = defaultPrefs.defaultDeliveryMethodKey;
    private cityId: number = defaultPrefs.defaultCityId;
    private paymentKey: number = defaultPrefs.defaultPaymentMethodId;
    private languageId: number = 2;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private isNeedInstallProducts: boolean = false;
    private listOfDisabledDeliveryForCach: number[] = [7, 8];//7-delivery,8 ukr-pochta

    constructor(
        private _deliveryPointService: DeliveryMethodsService,
        private _languageService: LanguageService,
        private store: Store<fromShopingCart.State>,
    ) { }

    ngOnInit() {
        this.setLanguage();

        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.setLanguage();
        });

        this.paymentMethodId$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(paymentMethodId => {
            this.paymentKey = paymentMethodId || defaultPrefs.defaultPaymentMethodId;
            this.changeDeliveryMethodsAvailability();
        });

        this.shipmentKey$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(deliveryTypeKey => {
            this.shipmentKey = deliveryTypeKey || defaultPrefs.defaultDeliveryMethodKey;
            this.pointsCount = null;
            this.loadDeliveryMethods();
        });

        this.pointsCount$.pipe(takeUntil(this.destroy$)).subscribe(count => this.pointsCount = count);

        this.cart$ = this.store.select(fromShopingCart.getCart);
        this.cart$.pipe(takeUntil(this.destroy$)).subscribe(x => {
            let productsForInstall = x.products.filter(x => x.isNeedToInstall);
            this.isNeedInstallProducts = productsForInstall.length ? true : false;
            this.changeDeliveryMethodsAvailability();
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public setDeliveryType(): void {
        this.shipmentKey = this.selectedDelivery.Key;
        this.onDeliveryTypeSelect.emit(this.selectedDelivery);
    }

    private setLanguage(): void {
        let language = this._languageService.getSelectedLanguage();
        this.languageId = (language && language.id) ? language.id : this.languageId;
    }

    private loadDeliveryMethods(): void {
        this._deliveryPointService.GetDeliveryMethods(this.paymentKey, this.cityId, this.languageId)
            .pipe(takeUntil(this.destroy$)).subscribe(deliveryMethods => {
                this.deliveryMethods = deliveryMethods;
                if (!this.shipmentKey) {
                    this.selectedDelivery = deliveryMethods[0];
                }
                this.selectedDelivery = deliveryMethods.find(d => d.Key == this.shipmentKey) || this.selectedDelivery;
                this.setDeliveryType();
                this.changeDeliveryMethodsAvailability();
            });
    }

    private changeDeliveryMethodsAvailability() {
        if (this.isNeedInstallProducts && this.deliveryMethods.length) {
            this.selectedDelivery = this.deliveryMethods[0];
            this.setDeliveryType();
        }
        this.deliveryMethods.forEach(dm => {
            //pay card
            if (this.paymentKey == 24 && dm.Id !== 4) {
                dm.isAvaiable = !this.isNeedInstallProducts;
            }
            //pay cashe
            else if (this.paymentKey == 21) {
                dm.isAvaiable = !this.listOfDisabledDeliveryForCach.includes(dm.Id);
            }
        });
        if (this.selectedDelivery && !this.selectedDelivery.isAvaiable)
        {
            this.selectedDelivery = this.deliveryMethods[0];
            this.setDeliveryType();
        }
    }
}