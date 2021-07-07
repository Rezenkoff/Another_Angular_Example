import { Component, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { OrderPopupComponent } from "..";
import { Observable, of, Subscription, Subject } from "rxjs";
import { CartProduct } from "../../models/shoping-cart-product.model";
import { ShopingCartModelService } from "../../services/shoping-cart-model.service";
import { GtagService } from "../../../services/gtag.service";
import { timer } from 'rxjs';
import { DiscountModel } from "../../models/discount.model";
import { Store } from "@ngrx/store";
import * as fromShopingCart from '../../../shoping-cart/reducers';
import * as orderUserInfo from '../../../order-user-info/actions/order-user-info.actions';
import * as fromOrderUserInfo from '../../../order-user-info/reducer';

@Component({
    selector: 'order-summary',
    templateUrl: './__mobile__/order-summary.component.html',
})
export class OrderSummaryComponent {
    @Input() deliveryTypeKey$: Observable<number> = new Observable<number>();
    @Input() discount: DiscountModel;
    @Output() orderSubmited: EventEmitter<void> = new EventEmitter<void>();
    @ViewChild("orderpop") public orderPopup: OrderPopupComponent;

    public product$: Observable<CartProduct> = new Observable<CartProduct>();
    public allowPush: boolean = true;
    public timeForShow: string = '01:00';
    public discountAmount$: Observable<number> = new Observable<number>();

    private sendRemarketingAfterValid = true;
    private optionForRemarketing = "extended order";
    private pointerTimer: Subscription = new Subscription();
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _orderModelService: ShopingCartModelService,
        private _gtagService: GtagService,
        private _store: Store<fromShopingCart.State>,
        private store: Store<fromOrderUserInfo.State>,
    ) { }

    ngOnInit() {
        this.product$ = of(null);
        this.discountAmount$ = this._store.select(fromShopingCart.getDiscountAmount);
    }

    ngOnDestroy(): void {
        this.pointerTimer.unsubscribe();
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public editProductsList(): void {
        this.orderPopup.toggleWindow();
    }

    public submitEnabled(): boolean {
        let result: boolean = false;
        if (
            this._orderModelService.isOrderValid
        ) {
            result = true;
        }

        if (result && this.sendRemarketingAfterValid) {
            this.sendRemarketingAfterValid = false;
        }

        return result;
    }

    public submit(): void {
        this.startTimer();
        this.orderSubmited.emit();
    }

    private startTimer() {
        this.allowPush = false;
        const source = timer(0, 1000);
        this.pointerTimer = source.subscribe(val => {
            this.timeForShow = (val >= 50 ? "00:0" : "00:") + (59 - val).toString();
            if (val == 60) {
                this.pointerTimer.unsubscribe();
                this.allowPush = true;
            }
        });
    }

    public addDiscount(discount: DiscountModel) {
        let promo = discount ? discount.promo : null;
        this.store.dispatch(new orderUserInfo.SetPromo(promo));
        this.discount = discount;
    }
}