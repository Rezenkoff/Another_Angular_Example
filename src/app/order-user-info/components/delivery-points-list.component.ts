import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import * as defaultPrefs from '../../config/default-user-preferences';
import { DeliveryPointGeocoded } from '../../delivery/points/delivery-point-geocoded.model';

@Component({
    selector: 'delivery-points-list',
    templateUrl: './__mobile__/delivery-points-list.component.html'
})

export class DeliveryPointsListComponent implements OnInit {

    @Input() shipmentKey: number = 0;
    @Input() deliveryPointKey$: Observable<string> = new Observable<string>();
    @Input() deliveryMarkers$: Observable<DeliveryPointGeocoded[]> = new Observable<DeliveryPointGeocoded[]>();
    @Input() spinnerOn$: Observable<boolean> = new Observable<boolean>();
    @Input() public deliveryMethodKey$: Observable<number> = new Observable<number>();

    @Output() onSelectMarker: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();

    private pointKey: string = null;
    private emptyStr: string = '';
    public pointName: string = '';
    public showDropDown: boolean = false;
    public deliveryMarkers: DeliveryPointGeocoded[] = [];
    public tmpDeliveryMarkers: DeliveryPointGeocoded[] = [];
    public isStoDelivery: boolean = false;
    private destroy$ = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
    ) { }

    ngOnInit() {
        this.deliveryPointKey$.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe(id => {
                this.pointKey = id;
                this.setInputText();
            });  
        this.deliveryMarkers$.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe(markers => {
                this.pointName = '';
                this.deliveryMarkers = markers;
                this.tmpDeliveryMarkers = this.deliveryMarkers;
                if (!markers || !markers.length) {
                    return;
                }
                let marker = this.findMarkerByRef(this.pointKey);
                if (marker) {
                    this.selectDeliveryPoint(marker);
                } else {                    
                    this.onSelectMarker.emit(null);
                }
            });
        this.deliveryMethodKey$.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe(result => {
                this.isStoDelivery = result === defaultPrefs.stoDeliveryKey || result === defaultPrefs.tireFittingDeliveryKey;
            });
    }
    
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }    

    private setInputText(): void {
        this.pointName = '';
        let marker = this.findMarkerByRef(this.pointKey);
        this.pointName = (marker) ? this.setPointName(marker) : this.pointName;
    }

    private findMarkerByRef(key: string): DeliveryPointGeocoded {
        if (!this.tmpDeliveryMarkers || !this.tmpDeliveryMarkers.length || !this.pointKey) {
            return;
        }
        return this.tmpDeliveryMarkers.find(m => m.refKey == this.pointKey);
    }

    public selectDeliveryPoint(marker: DeliveryPointGeocoded): void {
        this.pointName = this.setPointName(marker);
        this.showDropDown = false;
        this.onSelectMarker.emit(marker);
    } 
    
    public getDisplay(): string {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }

    public hideDropdown(): void {
        this.showDropDown = false;
    }

    public deliveryFilter(text: string): void {
        if (!text) {
            this.onSelectMarker.emit(new DeliveryPointGeocoded());
        }
        this.tmpDeliveryMarkers = this.deliveryMarkers.filter(m => m.shortName.toLowerCase().includes(text.toLowerCase()));
    }

    public trackByFn(index, item) {
        return index;
    }

    private setPointName(marker: DeliveryPointGeocoded) {
        return (this.isStoDelivery) ? this.getNameCityFree(marker.address) : marker.shortName; 
    }

    public getNameCityFree(nameAdress: string): string{
        if(nameAdress.split(';')[2] || this.isStoDelivery)
            return nameAdress.split(';')[2];
        else
            return nameAdress;
    }
}
