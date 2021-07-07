import { Component, Input, EventEmitter, Output, OnDestroy, OnInit, Inject } from "@angular/core";
import { CenterMapModel } from "../../google-maps/models/CenterMapModel";
import { DeliveryPointGeocoded } from "../../delivery/points/delivery-point-geocoded.model";
import { Observable, Subject } from "rxjs";
import { SettlementModel } from "../../location/settlement/settlement.model";
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { takeUntil, distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: 'delivery-points-map',
    templateUrl: './__mobile__/delivery-points-map.component.html'
})
export class DeliveryPointsMapComponent implements OnInit, OnDestroy {

    @Input() public markersList$: Observable<DeliveryPointGeocoded[]> = new Observable<DeliveryPointGeocoded[]>();
    @Input() public selectedSettlement$: Observable<SettlementModel> = new Observable<SettlementModel>();
    @Input() public selectedDeliveryPointKey$: Observable<string> = new Observable<string>();
    @Input() public deliveryMethodKey$: Observable<string> = new Observable<string>();

    @Output() public onClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() public onSelectMarker: EventEmitter<DeliveryPointGeocoded> = new EventEmitter<DeliveryPointGeocoded>();

    private destroy$: Subject<boolean> = new Subject<boolean>();
    private markerZoomDefault: number = 10;
    private markerZoom: number = 16;
    private selectedSettlement: SettlementModel = null;
    @Input() public zoom: number = this.markerZoomDefault;
    public centerMap: CenterMapModel = new CenterMapModel();
    public selectedPoint: DeliveryPointGeocoded = null;
    public firstMarker: DeliveryPointGeocoded = null;

    constructor(
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
    ) { }

    ngOnInit() {
        this.selectedSettlement$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(settlement => {
            this.selectedSettlement = settlement;
            this.setCityCenter();
        });

        this.selectedDeliveryPointKey$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(pointKey => {
            this.markersList$.subscribe(list => {
                this.selectedPoint = list.find(x => x.refKey == pointKey);
                if (list.length > 0) {
                    this.firstMarker = list[0];
                }
                this.setCenterMap();
            });
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public trackByFn(index, item) {
        return index;
    }

    public setCenterMap(): void {
        if (this.selectedPoint && this.selectedPoint.latitude) {
            this.zoom = this.markerZoom
            this.centerMap.latitude = this.selectedPoint.latitude || this.selectedSettlement.latitude;
            this.centerMap.longitude = this.selectedPoint.longitude || this.selectedSettlement.longitude;
            return;
        }
        this.setCityCenter();
    }

    private setCityCenter(): void {
        if (!this.selectedSettlement) {
            return;
        }
        this.zoom = this.markerZoomDefault;
        if (this.firstMarker && this.selectedSettlement.latitude === 0 && this.selectedSettlement.longitude === 0) {
            this.centerMap.latitude = this.firstMarker.latitude;
            this.centerMap.longitude = this.firstMarker.longitude;
        }
        else {
            this.centerMap.latitude = this.selectedSettlement.latitude;
            this.centerMap.longitude = this.selectedSettlement.longitude;
        }
    }

    public closeWindow(): void {
        this.onClose.emit();
    }

    public nameOnMapShown(marker: DeliveryPointGeocoded): boolean {
        return Boolean(this.selectedPoint && marker.refKey == this.selectedPoint.refKey);
    }

    public selectMarker(marker: DeliveryPointGeocoded): void {
        this.selectedPoint = marker;
        this.onSelectMarker.emit(marker);
        this.setCenterMap();
    }

    public applyMarket(marker: DeliveryPointGeocoded): void {
        this.selectMarker(marker);
        this.closeWindow();
    }
    public navigate(point) {
        var url = 'http://www.google.com/maps/place/' + point.latitude + ',' + point.longitude;
        window.open(url, "_blank");
    }
}