import { Component, EventEmitter, Output, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as defaultPrefs from '../../config/default-user-preferences';
import { DeliveryPointGeocoded } from '../../delivery/points/delivery-point-geocoded.model';
import { SettlementModel } from '../../location/settlement/settlement.model';


@Component({
    selector: 'delivery-points-select',
    templateUrl: './__mobile__/delivery-points-select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryPointsSelectComponent extends BaseBlockComponent {
       
    @Input() shipmentKey: number = defaultPrefs.defaultDeliveryMethodKey;
    @Input() selectedDeliveryPointKey$: Subject<string> = new Subject<string>();
    @Input() public markersList$: Observable<DeliveryPointGeocoded[]> = new Observable<DeliveryPointGeocoded[]>();
    @Input() public selectedSettlement$: BehaviorSubject<SettlementModel> = new BehaviorSubject<SettlementModel>(null);
    @Input() public spinnerOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Input() public deliveryMethodKey$: Observable<string> = new Observable<string>();

    @Output() deliveryPointChanged: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();
    
    public selectedPoint: DeliveryPointGeocoded = null;

    public mapShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(     
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        private _cd: ChangeDetectorRef,
    ) {
        super(constants);
    }

    public selectMarker(marker: DeliveryPointGeocoded): void {
        this.selectedPoint = marker;
        this.deliveryPointChanged.emit(marker);
        if (marker) {
            this.selectedDeliveryPointKey$.next(marker.refKey);
        }
    }

    public showMap() {
        this._cd.detectChanges();
        this.mapShown$.next(true);
    }

    public closeMap() {
        this._cd.detectChanges();
        this.mapShown$.next(false);
    }
}
