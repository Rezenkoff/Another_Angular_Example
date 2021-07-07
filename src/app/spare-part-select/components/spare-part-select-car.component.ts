import { Component, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { UserCar } from "../../vehicle/models/user-car.model";
import { SparePartSelectEnum } from "../models/enums/spare-part-select-type.enum";
import { VinSearchService } from "../../services/vinsearch.service";
import { AuthHttpService } from "../../auth/auth-http.service";
import { CarsPanelStateChange } from "../../car-select-panel/models/cars-panel-state-change.model";
import { GenericFilterSearchParamModel } from "../../filters/models/generic-filter-search-param.model";
import * as search from '../../search/actions/search.actions';
import * as fromVehicle from '../../vehicle/reducers';
import * as filtersActions from '../../filters/actions/filters.actions';
import * as fromSearch from '../../search/reducers';
import * as fromFilters from '../../filters/reducers';
import { CarFilterKeys } from "../../filters/models/car-filter-keys";
import { Store } from "@ngrx/store";
import { OrderStepService } from "../../order-step/order-step.service";
import { CarSelectPanelService } from "../../car-select-panel/services/car-select-panel.service";
import { CarMark } from "../../cars-catalog/models/car-mark.model";
import { PolisService } from "../../polis/polis.service";
import { takeUntil } from "rxjs/operators";
import * as carValidator from '../../vehicle/models/car-validator-provider';
import * as vehicle from '../../vehicle/actions/vehicle.actions';

@Component({
    selector: 'spare-part-select-car',
    templateUrl: './__mobile__/spare-part-select-car.component.html'
})
export class SparePartSelectCarComponent implements OnInit, OnDestroy {

    public carMarks: CarMark[];
    public foundCar: UserCar;
    public isSearching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public garageCarsCount$: Observable<number>;
    public userCars: UserCar[];

    public searchType: SparePartSelectEnum = SparePartSelectEnum.SelectByVIN;
    @Output() selectedCar = new EventEmitter<UserCar>();

    private destroy$: Subject<boolean> = new Subject<boolean>();
    
    constructor(private _vinSearchService: VinSearchService,
        private _filterStore: Store<fromFilters.State>,
        private _searchStore: Store<fromSearch.State>,
        private _vehicleStore: Store<fromVehicle.State>,
        private _authHttpService: AuthHttpService,
        public orderStepService: OrderStepService,
        private _carSelectPanelService: CarSelectPanelService,
        private _polisService: PolisService,
    ) {
        this.garageCarsCount$ = this._vehicleStore.select(fromVehicle.getActiveUserVehiclesCount);
    }

    ngOnInit() {
        if (this.orderStepService.OrderStepMainModel.Vehicle.mark) {
            this.foundCar = this.orderStepService.OrderStepMainModel.Vehicle;
        }

        this._vehicleStore.select(fromVehicle.getUserVehicles).pipe(takeUntil(this.destroy$)).subscribe(cars => {
            this.userCars = cars;
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public isAuthenticated() {
        return this._authHttpService.isAuthenticated();
    }

    public vinSearch(code: string): void {
        this.isSearching$.next(true);
        this.searchByVin(code);
    }

    public governmentNumSearch(code: string): void {
        this.isSearching$.next(true);
        this._polisService.GetCarInfoByNumber(code).subscribe((result: any) => {
            if (result.success && result.data.car.vin) {
                this.searchByVin(result.data.car.vin);
            }
            if (!result.success) {
                this.isSearching$.next(false);
                this.foundCar = null;
            }
        });
    }

    public selectVinSearchType() {
        this.searchType = SparePartSelectEnum.SelectByVIN;
    }

    public selectByModelSearchType() {
        this.searchType = SparePartSelectEnum.SelectByModel;
    }

    public selectByGarageSearchType() {
        this.searchType = SparePartSelectEnum.SelectFromGarage;
    }

    public modelSearch(changes: CarsPanelStateChange[]): void {
        let emptyFilters: string[] = [];
        changes.forEach(c => {
            let key = (c.selectedOptions.length) ? c.selectedOptions[0].key : null;

            this._filterStore.dispatch(new filtersActions.SelectDropdownOptionAction({ filterType: c.filterType, options: c.selectedOptions }));

            if (key) {
                let filterSearchParam = new GenericFilterSearchParamModel(c.filterType, key);
                this._searchStore.dispatch(new search.SetGenericFilterValue(filterSearchParam));
            } else {
                emptyFilters.push(c.filterType);
            }
        })

        if (emptyFilters.length) {
            this._searchStore.dispatch(new search.DeleteGenericFiltersByTypes(emptyFilters));
            this.foundCar = null;
        }
        if (changes[2].selectedOptions.length > 0) {
            let car = new UserCar();
            changes.forEach(c => {
                switch (c.filterType) {
                    case CarFilterKeys.markKey:
                        car.markKVP = c.selectedOptions[0] || null;
                        car.mark = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                        break;
                    case CarFilterKeys.serieKey:
                        car.serieKVP = c.selectedOptions[0] || null;
                        car.model = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                        break;
                    case CarFilterKeys.yearKey:
                        car.yearKVP = c.selectedOptions[0] || null;
                        car.year = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                        break;
                    case CarFilterKeys.modelKey:
                        car.modelKVP = c.selectedOptions[0] || null;
                        break;
                    case CarFilterKeys.modifKey:
                        car.modifKVP = c.selectedOptions[0] || null;
                        break;
                    default:
                        return;
                }
            });
            this.foundCar = car;
            this.foundCar.markId = this.getIdFromMarkKVP(car.markKVP.key);
        }
    }

    public selectCarFromGarage(item: UserCar) {
        this.foundCar = item;
    }

    public closeSelectedCar() {
        this.foundCar = null;
    }

    public goToNextStep() {
        if (!this.foundCar) {
            return;
        }
        this.orderStepService.OrderStepMainModel.Vehicle = this.foundCar;
        this.selectedCar.emit(this.foundCar);
    }

    public getNextStepButtonClass() {
        if (this.searchType === SparePartSelectEnum.SelectByVIN) {
            return this.foundCar ? "btn-blue vin-btn" : "vin-btn-dis btn-blue-disable";
        }
        if (this.searchType === SparePartSelectEnum.SelectByModel || this.searchType === SparePartSelectEnum.SelectFromGarage) {
            return this.foundCar ? "vin-btn btn-blue" : "vin-btn btn-blue-disable";
        }
    }

    public getYearFromDate(date: string) {
        if (date.length === 0) {
            return '';
        }
        if (date.length === 4) {
            return date;
        }
        let splittedDate = date.split('.');
        return splittedDate[2];
    }

    private getIdFromMarkKVP(markKVP): number {
        let startIdx = markKVP.indexOf('-id') + 3;
        let endInx = markKVP.indexOf('--');
        endInx = (endInx > 0) ? endInx : markKVP.length;
        return Number(markKVP.substring(startIdx, endInx));
    }

    private geMarkIdByMarkName(name: string) {
        var markList = this.carMarks.filter(x => x.markName.toLowerCase() == name.toLowerCase());
        if (markList.length !== 0) {
            return this.getIdFromMarkKVP(markList[0].markKey);
        }
    }

    private searchByVin(vin: string) {
        this._vinSearchService.SearchByVin(vin)
            .subscribe(foundVehicle => {
                if (foundVehicle&& carValidator.isValidUserCar(foundVehicle)) {
                    if (this.isAuthenticated()) {
                        this.addVehicle(foundVehicle)
                    }
                    this.foundCar = foundVehicle;
                    if (foundVehicle.mark) {

                        this._carSelectPanelService.getMarks().subscribe(result => {
                            this.carMarks = result;
                            this.foundCar.markId = this.geMarkIdByMarkName(foundVehicle.mark);
                        }); 
                    }
                }
                this.isSearching$.next(false);
            }, err => {
                this.isSearching$.next(false);
            });
        this.isSearching$.next(false);
    }

    private addVehicle(selectedCar: UserCar) {

        let carAlreadyExists: boolean = carValidator.isAlreadyAdded(selectedCar, this.userCars);

        if (!carAlreadyExists) {
            selectedCar.isActive = true;
            this._vehicleStore.dispatch(new vehicle.AddVehicleAction(selectedCar));
        }
    }
}