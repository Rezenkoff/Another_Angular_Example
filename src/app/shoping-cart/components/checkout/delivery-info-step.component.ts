import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, HostListener } from "@angular/core";
import { Observable, of, BehaviorSubject, Subject } from "rxjs";
import { StepsNamesEnum } from "../../models/steps-names.enum";
import { UserService } from "../../../services/user.service";
import { Area } from "../../../location/area/area.model";
import * as fromOrderUserInfo from '../../../order-user-info/reducer';
import * as orderUserInfo from '../../../order-user-info/actions/order-user-info.actions';
import { Store } from '@ngrx/store';
import { ShipmentType } from "../../../order-step/models";
import { DeliveryPointGeocoded } from "../../../delivery/points/delivery-point-geocoded.model";
import { SettlementModel } from "../../../location/settlement/settlement.model";
import { takeUntil, debounceTime } from "rxjs/operators";
import { UserDeliveryInfo } from "../../../order-user-info/models/user-delivery-info.model";
import { DiscountModel } from "../../models/discount.model";
import { OrderTireFitting } from "../../models/order-tire-fitting.model";

@Component({
    templateUrl: './__mobile__/delivery-info-step.component.html',
    selector: 'delivery-info-step'
})
export class DeliveryInfoStepComponent implements OnInit {

    @Output() onUserDeliveryInfoChange: EventEmitter<UserDeliveryInfo> = new EventEmitter<UserDeliveryInfo>();
    @Output() onOrderSubmit: EventEmitter<void> = new EventEmitter<void>();
    @Input() enabledStep$: Observable<StepsNamesEnum> = new Observable<StepsNamesEnum>();
    public isActive$: Observable<boolean> = new Observable<boolean>();
    public initialPaymentMethodId: number;
    public paymentMethodId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public deliveryTypeKey$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public areaId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public settlementKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public deliveryPointKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public selectedDeliveryPoint$: BehaviorSubject<DeliveryPointGeocoded> = new BehaviorSubject<DeliveryPointGeocoded>(null);
    public userAddress: string = '';
    public commentDisplayed: boolean = false;
    public orderComment: string = '';
    public discount: DiscountModel;
    public tireFittingOrder: OrderTireFitting;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    public dateArray: OrderTireFitting[] = [];

    isFloating: boolean = false;
    isStickToBottom: boolean = false;

    constructor(
        private store: Store<fromOrderUserInfo.State>,
        private _userService: UserService,
    ) { }

    ngOnInit() {
        this.store.select(fromOrderUserInfo.getUserDeliveryInfo)
            .pipe(takeUntil(this._destroy$), debounceTime(150))
            .subscribe(data => this.onUserDeliveryInfoChange.emit(data));

        this.enabledStep$.subscribe(step => {
            const enabled = (step == StepsNamesEnum.DeliveryInfo);
            this.isActive$ = of(enabled);
        });

        let user = this._userService.getCurrentUser();

        this.initialPaymentMethodId = user.userPreferences.paymentMethodId;
        this.deliveryTypeKey$.next(user.userPreferences.deliveryMethodKey);
        this.areaId$.next(user.userPreferences.areaId);
        this.settlementKey$.next(user.userPreferences.settlementKey);
        this.deliveryPointKey$.next(user.userPreferences.deliveryPointKey);
        this.userAddress = user.userPreferences.userAddress || this.userAddress;

        this.tireFittingOrder = new OrderTireFitting(this.getDatesForTireFitting()[0], this.getTimeForTireFitting()[0]);
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    @HostListener('window:scroll', ['$event'])
    onScroll() {
        this.isFloating = window.pageYOffset >= 250 && window.pageYOffset <= 650;
        this.isStickToBottom = window.pageYOffset > 650;
    }

    public onPaymentChange(paymentTypeId: number): void {
        this._userService.updateUserPaymentType(paymentTypeId);
        this.paymentMethodId$.next(paymentTypeId);
        this.store.dispatch(new orderUserInfo.SetPaymentMethod(paymentTypeId));
    }

    public setSelectedArea(area: Area): void {
        this._userService.updateUserArea(area);
        this.store.dispatch(new orderUserInfo.SetAreaInfo(area));
    }

    public setDeliveryType(shipmentType: ShipmentType): void {
        this._userService.updateUserDeliveryType(shipmentType.Key);
        this.store.dispatch(new orderUserInfo.SetDeliveryMethod(shipmentType));
    }

    public setSelectedSettlement(settlement: SettlementModel): void {
        if (settlement) {
            this._userService.updateUserCity(settlement.cityKey);
        }
        this.store.dispatch(new orderUserInfo.SetUserCity(settlement));
    }

    public setUserAddress(deliveryPoint: DeliveryPointGeocoded): void {
        this._userService.updateUserAddress(deliveryPoint.address);
        this.store.dispatch(new orderUserInfo.SetDeliveryPoint(deliveryPoint));
        this.store.dispatch(new orderUserInfo.SetUserAddress(deliveryPoint.address));
    }

    public setDeliveryPoint(deliveryPoint: DeliveryPointGeocoded): void {
        this.selectedDeliveryPoint$.next(deliveryPoint);
        let deliveryPointKey = (deliveryPoint) ? deliveryPoint.refKey : null;
        if (deliveryPointKey) {
            this._userService.updateUserDeliveryPoint(deliveryPointKey);
        }
        this.store.dispatch(new orderUserInfo.SetDeliveryPoint(deliveryPoint));
    }

    public showComment(): void {
        this.commentDisplayed = true;
    }

    public hideComment(): void {
        this.commentDisplayed = false;
    }

    public updateComment(): void {
        this.store.dispatch(new orderUserInfo.SetComment(this.orderComment));
    }

    public submit(): void {
        this.onOrderSubmit.emit();
    }

    public addDiscount(discount: DiscountModel) {
        let promo = discount ? discount.promo : null;
        this.store.dispatch(new orderUserInfo.SetPromo(promo));
        this.discount = discount;
    }

  public tireFittingOrderChange() {

    this.orderComment = this.orderComment.replace(/^Заказать шиномонтаж: (0?[1-9]|[12][0-9]|3[01]) [а-яА-Я]+ (0?[1-9]|[12][0-9]|3[01]):\d\d$/i, '');

    if (this.tireFittingOrder.tireFittingOrderSelected) {
      this.orderComment += `Заказать шиномонтаж: ${this.tireFittingOrder.tireFittingDate} ${this.tireFittingOrder.tireFittingTime}`;
    }

    let dateInfo = this.dateArray.filter(x => x.tireFittingDate == this.tireFittingOrder.tireFittingDate)[0];
    dateInfo.fittigDate.setHours(parseInt(this.tireFittingOrder.tireFittingTime.split(':')[0]));
    dateInfo.fittigDate.setMinutes(parseInt(this.tireFittingOrder.tireFittingTime.split(':')[1]));
    dateInfo.fittigDate.setSeconds(0);

    this.updateComment();
    this.updateTireFittingDate(dateInfo.fittigDate);
  }

  private updateTireFittingDate(date: Date) {

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var time = day + "/" + month + "/" + year + " " + hour + ':' + minute + ':' + second;

    this.store.dispatch(new orderUserInfo.SetTireFittingDate(time));
  }

  public getDatesForTireFitting() {
    this.dateArray = [];
    let result = [];
    for (let day = 1; day <= 10; day++) {
      let date = new Date().setDate(new Date().getDate() + day);

      let stringDate = new Date(date).toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
      });
      result.push(stringDate);

      let info = new OrderTireFitting(stringDate, "");
      info.fittigDate = new Date(date);

      this.dateArray.push(info);
    }

    return result;
  }

    public getTimeForTireFitting() {
        let start = 9, end = 19;
        let result = new Array(end - start + 1).fill(0).map((_, idx) => `${start + idx}:00`);
        return result;
    }
}
