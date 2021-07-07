import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy, Inject, PLATFORM_ID } from "@angular/core";
import { CatalogType } from "../../../catalog/models/catalog-type.enum";
import { ActivatedRoute } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { StoService } from "../../../sto/sto.service";
import { LocationService } from "../../../location/location.service";
import { MarkerModel } from "../../../google-maps/models/marker";
import { CenterMapModel } from "../../../google-maps/models/CenterMapModel";
import { StrKeyValueModel } from "../../../models/key-value-str.model";
import { TiresParam } from "../../../models/tire-params.model";
import { Settlement } from "../../../location/location.model";

@Component({
    selector: 'vehicle-type-switch',
    templateUrl: './__mobile__/vehicle-type-switch.component.html',
    styleUrls: ['./__mobile__/styles/vehicle-type-switch.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleTypeSwitchComponent {

    public stoList: MarkerModel[] = new Array<MarkerModel>();
    public passengerType = CatalogType.Passenger;
    public truckType = CatalogType.Truck;
    public allType = CatalogType.Full;
    public needShow = false;
    private settlementId: number = null;
    mode: string = 'DP';
    private areaId: number = 0;
    public centerMap: CenterMapModel = new CenterMapModel();
    selectedMarker: MarkerModel = new MarkerModel();
    public zoom: number = 10;

    public dictionaryList: EventEmitter<Map<string, Array<string>>>;
    public keysList: any;
    public tiresSizeValueKey: Array<StrKeyValueModel>;
    public tiresSizeDiameter: Array<StrKeyValueModel>;

    onLoadDictionaryList(_dictionaryList: any) {
        this.dictionaryList = _dictionaryList;
    }

    onLoadKeysDictionary(_keysList: any) {     
        this.keysList = _keysList;
    }

    onLoadTiresSize(tiresSize: Array<StrKeyValueModel>) {
        this.tiresSizeValueKey = tiresSize;
    }

    onLoadDiameter(tiresDiameter: Array<StrKeyValueModel>) {
        this.tiresSizeDiameter = tiresDiameter;
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


    public isTires: boolean = true;

    constructor(private _activatedRoute: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _stoService: StoService,
        public locationService: LocationService)
    {
        let params = _activatedRoute.snapshot.params;
        this.needShow = (params.urlEnding == 'shiny-i-diski-id6-3' ? true : false);
    }

    ngOnInit() {
        //let params = this._activatedRoute.params;
        this.settlementId = this.locationService.selectedLocation.id;
        this.areaId = this.locationService.selectedLocation.areaId;
        this.loadDeliveryPoints();
        this.setCenterMap(); 
    }

    @Input() catalogType: number = CatalogType.Passenger;
    @Output() catalogTypeSelected: EventEmitter<CatalogType> = new EventEmitter<CatalogType>();

    getClass(type: number): string {
        return (type == this.catalogType) ? 'btn btn-vehicle active' : 'btn btn-vehicle-type ';
    }

    setActive(type: number): void {
        if (type == this.catalogType) {
            return;
        }
        this.catalogType = type;
        this.catalogTypeSelected.emit(type);
    }

    public toggleTiresWheels() {
        this.isTires = !this.isTires;
    }

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    public loadAllSto() {
        if (isPlatformBrowser(this.platformId)) {
            this._stoService.getAllSto(this.settlementId).subscribe(
                data => {
                    this.mode = "ALL";
                    this.stoList = data as MarkerModel[];
                }
            );
        }
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

    public selectMarker(marker: MarkerModel) {
        this.selectedMarker = marker;
    }
    public setCenterMap() {
        this.centerMap.latitude = this.selectedMarker.latitude || this.locationService.selectedLocation.latitude;
        this.centerMap.longitude = this.selectedMarker.longitude || this.locationService.selectedLocation.longitude;
    }

    public getQueryParams(param: string): Object {
  
        if (this.tiresSizeValueKey != null && this.tiresSizeDiameter != null) {
            let object = new TiresParam();
            let arrParam = param.split('R');
            arrParam[1] = arrParam[1].replace(',','.');

            let key1 = this.tiresSizeDiameter.filter(o => o.value == arrParam[1]);
            let key2 = this.tiresSizeValueKey.filter(o => o.value == arrParam[0]);

            if (key1[0] != undefined && key2[0] != undefined) {
                object.Tire_Diameter = key1[0].key;
                object.Tire_FrameSize = key2[0].key;
                return object as Object;
            } 

            return new Object();  
        }
        return new Object();   
    }

    public getParam(key: string): Object {
        let object = new TiresParam();
         object.Tire_Season = key;
        return object as Object;
    }
}