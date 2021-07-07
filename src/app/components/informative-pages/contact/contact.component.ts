import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SearchParamsDeliveryPoint } from '../../../models/models_adm/search-params-dp.model';
import { DeliveryPointsAdminService } from '../../../services/delivery-points.service';
import { DeliveryPoint } from '../../../models/models_adm/delivery-point.model'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarkerModel } from '../../../google-maps/models/marker';
import { CenterMapModel } from '../../../google-maps/models/CenterMapModel';
import { Settlement, LocationService } from '../../../location';
import { StoService } from '../../../sto/sto.service';

@Component({
    selector: 'contact',
    templateUrl: './__mobile__/contact.component.html'
})
export class ContactComponent {

    public imgUrl: string = this.constants.G_MAPS.AUTODOC_MARKERS + "marker.png";
    public zoom: number = 9;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public searchParamsDeliveryPoint: SearchParamsDeliveryPoint = new SearchParamsDeliveryPoint();
    public totalItems: number = 0;
    public deliveryPoints: DeliveryPoint[] = [];
    selectedMarker: MarkerModel = new MarkerModel();
    public centerMap: CenterMapModel = new CenterMapModel(48.9943622, 31.3533923);
    private settlementId: number = null;
    private areaId: number = 0;
    mode: string = 'DP';
    stoList: MarkerModel[] = new Array<MarkerModel>();

    constructor(@Inject(APP_CONSTANTS) protected constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        public locationService: LocationService,
        private _stoService: StoService,
        private _dpService: DeliveryPointsAdminService) {
        this.searchParamsDeliveryPoint.isDeliveryPoint = 'true';
        this.searchParamsDeliveryPoint.selectedDeliveryMethodId = 4;
        this.searchParamsDeliveryPoint.isActive = 'true';
        this.searchParamsDeliveryPoint.pageSize = 1000;
    }

    ngOnInit() {
        this.getAllDeliveryPointsSTO();
        this.settlementId = this.locationService.selectedLocation.id;
        this.areaId = this.locationService.selectedLocation.areaId;
        this.loadDeliveryPoints();
        this.setCenterMap(); 
    }

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public getAllDeliveryPointsSTO() {
        this._dpService.getDeliveryPoints(this.searchParamsDeliveryPoint).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
            this.deliveryPoints = response.data;
            this.totalItems = response.total;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public selectMarker(marker: MarkerModel) {
        this.selectedMarker = marker;
    }
    public collapsed: boolean = true;

    showNumber(): void {
        this.collapsed = false;
    }

    public loadPoints(settlement: Settlement): void {
        this.settlementId = settlement.id;
        this.areaId = settlement.areaId;
        this.selectedMarker = new MarkerModel();
        this.selectedMarker.latitude = settlement.latitude;
        this.selectedMarker.longitude = settlement.longitude;
        this.loadDeliveryPoints();
        this.setCenterMap();
    }
    public loadDeliveryPoints() {
        if (isPlatformBrowser(this.platformId)) {
            this._stoService.getDeliveryPoints(this.settlementId, this.areaId).subscribe(
                data => {
                    this.mode = "DP";
                    this.stoList = data as MarkerModel[];
                }
            );
        }
    }
    public setCenterMap() {
        this.centerMap.latitude = this.selectedMarker.latitude || this.locationService.selectedLocation.latitude;
        this.centerMap.longitude = this.selectedMarker.longitude || this.locationService.selectedLocation.longitude;
    }
}

