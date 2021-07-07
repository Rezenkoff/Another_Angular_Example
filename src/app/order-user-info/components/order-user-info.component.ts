import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import * as fromOrderUserInfo from '../reducer';
import * as orderUserInfo from '../actions/order-user-info.actions';
import { Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../auth/models/current-user.model';
import { MainUserInfoModel } from '../models/main-user-info.model';
import { ShipmentType } from '../../order-step/models';
import { UserDeliveryInfo } from '../models/user-delivery-info.model';
import { Area } from '../../location/area/area.model';
import { SettlementModel } from '../../location/settlement/settlement.model';
import { DeliveryPointGeocoded } from '../../delivery/points/delivery-point-geocoded.model';

@Component({
    selector: 'order-user-info',
    templateUrl: './__mobile__/order-user-info.component.html',
})

export class OrderUserInfoComponent implements OnInit, OnDestroy {

    @Output() onUserDeliveryInfoChange: EventEmitter<UserDeliveryInfo> = new EventEmitter<UserDeliveryInfo>();
    
    public userInfo$: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);
    public deliveryTypeKey$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public initialSettlementKey: string;
    public areaId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public settlementKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public userAddress: string = '';
    public orderComment: string = '';
    public commentDisplayed: boolean = false;
    public initialPaymentMethodId: number;
    public paymentMethodId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public settlement$: Subject<SettlementModel> = new Subject<SettlementModel>();
    public deliveryPointKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(       
        private store: Store<fromOrderUserInfo.State>,
        private _userService: UserService
    ) { }

    ngOnInit() {
        this.store.select(fromOrderUserInfo.getUserDeliveryInfo).pipe(takeUntil(this.destroy$), debounceTime(150))
            .subscribe(data => this.onUserDeliveryInfoChange.emit(data));        

        let user = this._userService.getCurrentUser();
        user.phone = (user.phone && user.phone.length == 13) ? user.phone.substring(3, 13) : user.phone;
        this.userInfo$.next(user);        

        this.initialPaymentMethodId = user.userPreferences.paymentMethodId
        this.paymentMethodId$.next(this.initialPaymentMethodId);

        this.deliveryTypeKey$.next(user.userPreferences.deliveryMethodKey);
        this.userAddress = user.userPreferences.userAddress || this.userAddress;        

        this.areaId$.next(user.userPreferences.areaId);
        this.initialSettlementKey = user.userPreferences.settlementKey;
        this.settlementKey$.next(this.initialSettlementKey);
        this.deliveryPointKey$.next(user.userPreferences.deliveryPointKey);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public updateUserInfo(userData: MainUserInfoModel): void {
        this._userService.updateUserInfo(userData);
        this.store.dispatch(new orderUserInfo.SetUserInfo(userData));
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

    public setSelectedSettlement(settlement: SettlementModel): void {
        if (settlement) {
            this._userService.updateUserCity(settlement.cityKey);
        }
        this.store.dispatch(new orderUserInfo.SetUserCity(settlement));
    }

    public setDeliveryType(shipmentType: ShipmentType): void {
        this._userService.updateUserDeliveryType(shipmentType.Key);
        this.store.dispatch(new orderUserInfo.SetDeliveryMethod(shipmentType));
    }

    public setUserAddress(deliveryPoint: DeliveryPointGeocoded): void {    
        this._userService.updateUserAddress(deliveryPoint.address); 
        this.store.dispatch(new orderUserInfo.SetDeliveryPoint(deliveryPoint));
        this.store.dispatch(new orderUserInfo.SetUserAddress(deliveryPoint.address));
    }

    public updateComment(): void {
        this.store.dispatch(new orderUserInfo.SetComment(this.orderComment));
    }

    public setDeliveryPoint(deliveryPoint: DeliveryPointGeocoded): void {
        let deliveryPointKey = (deliveryPoint) ? deliveryPoint.refKey : null;
        if (deliveryPointKey) {
            this._userService.updateUserDeliveryPoint(deliveryPointKey);
        }
        this.store.dispatch(new orderUserInfo.SetDeliveryPoint(deliveryPoint));
    }

    public showComment(): void {
        this.commentDisplayed = true;
    }
}