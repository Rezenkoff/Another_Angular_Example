import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { ShipmentType } from "../../order-step/models/shipment-type.model";
import { takeUntil, distinctUntilChanged, finalize } from "rxjs/operators";
import * as defaultPrefs from '../../config/default-user-preferences';
import { SettlementModel } from "../../location/settlement/settlement.model";
import { Area } from "../../location/area/area.model";
import { DeliveryPointGeocoded } from "../../delivery/points/delivery-point-geocoded.model";
import { DeliveryPointsService } from "../../delivery/points/delivery-points.service";
import { AreaService } from "../../location/area/area.service";
import { LanguageService } from "../../services/language.service";
import { DistrictModel } from "../../location/district/district.model";
import { Store } from "@ngrx/store";
import * as fromShopingCart from '../../shoping-cart/reducers';

@Component({
    selector: 'delivery-settings',
    templateUrl: './__mobile__/delivery-settings.component.html'
})
export class DeliverySettingsComponent implements OnInit {

    @Input() shipmentKey$: BehaviorSubject<number> = new BehaviorSubject<number>(defaultPrefs.defaultDeliveryMethodKey);
    @Input() settlementKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);    
    @Input() deliveryPointKey$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    @Input() userAddress: string = '';
    @Input() paymentMethodId$: Observable<number> = new Observable<number>();

    @Output() onDeliveryTypeSelect: EventEmitter<ShipmentType> = new EventEmitter<ShipmentType>();
    @Output() onSettlementSelect: EventEmitter<SettlementModel> = new EventEmitter<SettlementModel>();
    @Output() onDeliveryPointSelect: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();    
    @Output() onCourierDeliverySelect: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();

    public settlementModel$: BehaviorSubject<SettlementModel> = new BehaviorSubject<SettlementModel>(null);
    public markers$: BehaviorSubject<DeliveryPointGeocoded[]> = new BehaviorSubject<DeliveryPointGeocoded[]>([]);
    public spinnerOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isCourierDelivery: boolean = false;
    public pointsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public productsForInstalling: number[] = [];
    public isStoOrTireFitting: boolean = false;

    private paymentMethodId: number = defaultPrefs.defaultPaymentMethodId;   
    private languageId: number = 2;
    private deliveryTypeKey: number = defaultPrefs.defaultDeliveryMethodKey;
    private settlement: SettlementModel = null;
    private markers: DeliveryPointGeocoded[] = [];
    private selectedPointKey: string = null; 
    private isMethodChanged: boolean = false;;   
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _areaService: AreaService,    
        private _deliveryPointsService: DeliveryPointsService,
        private _languageService: LanguageService,
        private cdref: ChangeDetectorRef,
        private store: Store<fromShopingCart.State>,
    ) { }

    ngOnInit() {
        this.paymentMethodId$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(paymentMethodId => {
            this.paymentMethodId = paymentMethodId || defaultPrefs.defaultPaymentMethodId;
            if (this.settlement && this.settlement.cityKey) {
                this.loadPoints();
            }
        });

        this.shipmentKey$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(deliveryTypeKey => {
            this.isCourierDelivery = (deliveryTypeKey === defaultPrefs.courierDeliveryKey);
            this.isStoOrTireFitting = (deliveryTypeKey === defaultPrefs.stoDeliveryKey || deliveryTypeKey == defaultPrefs.tireFittingDeliveryKey);
        });

        this.deliveryPointKey$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(pointKey => {
            this.selectedPointKey = pointKey;
        });

        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(lng => {
            
        });     

        this.store.select(fromShopingCart.getCart).pipe(takeUntil(this.destroy$)).subscribe(cart => {
            this.productsForInstalling = cart.products.filter(x => x.isNeedToInstall).map(x => x.articleId);
            if (this.settlement && this.settlement.cityKey) {
                this.loadPoints();
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public onDeliveryTypeChange(shipmentType: ShipmentType): void {
        this.deliveryTypeKey = shipmentType.Key;
        this.shipmentKey$.next(this.deliveryTypeKey);        
        this.onDeliveryTypeSelect.emit(shipmentType);
        this.isMethodChanged = true;
        this.clearPoints();

    }

    public onSettlementChange(settlement: SettlementModel): void {
        this.onSettlementSelect.emit(settlement);
        this.settlement = (settlement) ? settlement : null;        
        if (this.settlement) {
            this.settlementModel$.next(this.settlement);
            this.loadPoints();
        } else {
            this.clearPoints();
        }
    }

    public onDeliveryPointChange(point: DeliveryPointGeocoded): void {
        this.selectedPointKey = (point) ? point.refKey : null;
        this.onDeliveryPointSelect.emit(point);        
    }

    public onCourierDeliveryChange(address: string): void {
        let point = new DeliveryPointGeocoded();
        point.address = point.addressRus = point.addressUkr = address;
        point.shortName = point.shortNameRus = point.shortNameUkr = '';
        point.refKey = "";

        this.onCourierDeliverySelect.emit(point);
    }

    public setNovaPoshtaDeliveryType(){
        let settlement = new ShipmentType(0, '', defaultPrefs.novaPoshtaDeliveryKey, 1);
        this.onDeliveryTypeChange(settlement);
    }
    
    private loadPoints(): void {
        if (this.settlement && this.settlement.cityKey) {
            this.isMethodChanged = false;
            this.spinnerOn$.next(true);
            this._deliveryPointsService.getDeliveryPoints(this.settlement.cityKey, this.deliveryTypeKey, 
                this.paymentMethodId, this.languageId, this.productsForInstalling)
                .pipe(finalize(() => this.spinnerOn$.next(false)))
                .subscribe(points => {
                    if (this.isMethodChanged) {
                        this.clearPoints();
                        this.loadPoints();
                    }
                    else {
                        this.markers = points;
                        this.translatePointsInfo();
                        this.markers$.next(points);
                        this.pointsCount$.next(points ? points.length : 0);
                    }
                });
        }
        else {
            this.clearPoints();
        }
    }

    private clearPoints(): void {
        this.markers = [];
        this.markers$.next(this.markers);
        this.onDeliveryPointChange(null);        
    }

    private translatePointsInfo(): void {
        this.markers.forEach(x => {
            x.address = (this.languageId == 2) ? x.addressRus : x.addressUkr;
            x.shortName = (this.languageId == 2) ? x.shortNameRus : x.shortNameUkr;
        });
    }

    ngAfterViewInit() {
        this.cdref.detectChanges();
    }
}