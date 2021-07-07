import { Component, ViewChild, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StoService } from './sto.service';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { MarkerModel } from '../google-maps/models/marker';
import { LocationService } from '../location/location.service';
import { CenterMapModel } from '../google-maps/models/CenterMapModel';
import { Settlement } from '../location/location.model';
import { Subject } from 'rxjs';
import { StoAreaModel } from './models/sto-area.model';
import { AreaService } from '../location/area/area.service';
import { SettlementService } from '../location/settlement/settlement.service';
import { LanguageService } from '../services/language.service';
import { SettlementModel } from '../location/settlement/settlement.model';
import { PaymentService } from '../payment/payment.service';
import { StoPaymentMethodModel } from './models/sto-payment-method.model';

@Component({
    selector: 'sto',
    templateUrl: './__mobile__/sto.component.html'
})

export class StoComponent implements OnInit, OnDestroy {

    public stoList: MarkerModel[] = new Array<MarkerModel>();
    public selectedMarker: MarkerModel = new MarkerModel();
    public selectedCityMarker: MarkerModel = new MarkerModel();
    private markerZoomDefault: number = 6;
    private markerZoom: number = 16;
    public zoom: number = this.markerZoomDefault;
    public centerMap: CenterMapModel = new CenterMapModel();
    public mode: string = 'ALL';

    private settlementId: number = null;
    private areaId: number = 0;

    public closeFreeDelivery: boolean = true;
    public showAreas: boolean = false;
    public showStoAsList: boolean = false;
    public showDetailSto: boolean = false;
    public areas: StoAreaModel[] = [];
    public lngId: number = 2;
    private markerListZoom = 10;

    public paymentMethods: StoPaymentMethodModel[] = [{ key: 21, nameRus: 'Наличные', nameUkr: 'Готівкові', availableForPoint: false }, 
                                        { key: 24, nameRus: 'Предоплата на сайте', nameUkr: 'Передоплата на сайті', availableForPoint: false }];
    public selectedPaymentMethodKey: number = 0;

    public paymentMethodForSelectedPoint: number[] = [];

    @ViewChild('catalogStoTitle') catalogStoTitle: ElementRef;

    private destroy$: Subject<boolean> = new Subject<boolean>();


    constructor(private _stoService: StoService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public locationService: LocationService,
        private _areaService: AreaService,
        private _settlementService: SettlementService,
        private _languageService: LanguageService,
        private _paymntService: PaymentService) { }


    ngOnInit() {
        this.settlementId = this.locationService.selectedLocation.id;
        this.areaId = this.locationService.selectedLocation.areaId;
        this.loadAllActiveSto();

        this.initLanguage();
        this._languageService.getLanguageChangeEmitter().subscribe(() => this.initLanguage());
        this._areaService.getAreas().subscribe(result => this.areas = result as StoAreaModel[]);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
  }

  private loadAllActiveSto() {

    if (isPlatformBrowser(this.platformId)) {

      this._stoService.getAllActivePoints().subscribe(data => {
        this.mode = "ALL";
        this.stoList = data as MarkerModel[];
        this.setCenterMap();
      });
    }
  }

    public selectMarker(marker: MarkerModel) {
        this.selectedMarker = marker;
        this.showDetailSto = true;
        this.loadPaymentMethods();
    }

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public showOnMap(marker: MarkerModel) {
        this.selectedMarker = marker;
        this.setCenterMap();
        this.zoom = this.markerZoom;
        this.catalogStoTitle.nativeElement.scrollIntoView({ behavior: "smooth" });
        this.showDetailSto = false;
        this.selectedMarker = new MarkerModel();
    }

    public setCenterMap() {
      this.centerMap.latitude = this.selectedCityMarker.latitude || this.locationService.defaultLatitude;
      this.centerMap.longitude = this.selectedCityMarker.longitude || this.locationService.defaultLongitude;
    }

    public loadPoints(settlement: Settlement): void {
        this.initPoints(settlement.id, settlement.areaId, settlement.name, settlement.latitude, settlement.longitude);
    }

    public loadPoinstFromArea(settlement: SettlementModel) {
        let selectedMarkerName = this.lngId == 2 ? settlement.nameRus : settlement.nameUkr;
        this.initPoints(Number(settlement.cityKey), settlement.areaId, selectedMarkerName, settlement.latitude, settlement.longitude);
        this.showAreas = false;
    }

    public getImagePreviewUrl(imageUrl: string) {
        if (imageUrl == '') {
            return '';
        }
        let imageName = imageUrl.split('/').pop();
        let imagePreviewName = "Preview_" + imageName;
        let imagePreviewUrl = imageUrl.replace(imageName, imagePreviewName);
        return imagePreviewUrl;
    }

    public closeFreeDeliveryMessage() {
        this.closeFreeDelivery = false;
    }

    public toggleShowAreasButton(show: boolean) {
        this.showAreas = show;
    }

    public toggleShowStoAsList(show: boolean) {
        this.showStoAsList = show;
    }

    public clickBackFromDetailedSto() {
        this.selectedMarker = new MarkerModel();
        this.showDetailSto = false;
    }

    public showAreaSettlments(areaId: number, show: boolean) {
        const selectedArea = this.areas.find(x => x.areaId === areaId);
        if (show && (!selectedArea.settlements || selectedArea.settlements.length === 0)) {
            this._settlementService.getSettlementsForArea(areaId).subscribe(result => {
                selectedArea.settlements = result;
            });
        }
        selectedArea.showSettlements = show;
    }

    public changeOnlyDpCheckbox($event: any) {
        if ($event.currentTarget.checked) {
            this.loadDeliveryPoints();
        }
        else {
            this.loadAllSto();
        }
    }

    public getSchedule(schedule: string) {
        return schedule.split(';')
    }

    public changePayment() {
        this.loadpoints();
    }

    public getAvailablePaymentMethods(){
            return this.paymentMethods.filter(x => x.availableForPoint);
    }

    private initLanguage() {
        this.lngId = this._languageService.getSelectedLanguage().id;
    }

    private initPoints(settlementId: number, areaId: number, name: string, latitude: number, longitude: number) {
        this.settlementId = settlementId;
        this.areaId = areaId;
        this.selectedCityMarker = new MarkerModel();
        this.selectedCityMarker.name = name;
        this.selectedCityMarker.latitude = latitude;
        this.selectedCityMarker.longitude = longitude;
        this.setCenterMap();
        this.zoom = this.markerListZoom;
       // this.loadpoints();
    }

    private loadpoints() {
        if (this.mode == "ALL") {
            this.loadAllSto();
        }
        else {
            this.loadDeliveryPoints();
        }
        this.setCenterMap();
    }

    private loadAllSto() {
        if (isPlatformBrowser(this.platformId)) {
            this._stoService.getAllSto(this.settlementId, this.areaId, this.selectedPaymentMethodKey).subscribe(data => {
                this.mode = "ALL";
                this.stoList = data as MarkerModel[];
            });
        }
    }

    private loadDeliveryPoints() {
        if (isPlatformBrowser(this.platformId)) {
            this._stoService.getDeliveryPoints(this.settlementId, this.areaId, this.selectedPaymentMethodKey).subscribe(data => {
                this.mode = "DP";
                this.stoList = data as MarkerModel[];
            });
        }
    }

    private loadPaymentMethods() {
        this._paymntService.getPaymentsByDelyveryPointId(this.selectedMarker.id).subscribe(result => {
            if (result) {
                let paymentMethodForSelectedPoint = <any[]>result?.map(x => x.id);
                this.paymentMethods.forEach(x => x.availableForPoint = paymentMethodForSelectedPoint.includes(x.key));
            }
        });
    }
}
