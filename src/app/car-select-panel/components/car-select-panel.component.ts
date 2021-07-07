import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FilterTypesEnum } from '../../filters/models/filter-types.enum';
import { DropdownFilterModel } from '../../filters/models/dropdown-filter.model';
import { CarSelectPanelService } from '../services/car-select-panel.service';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Filter } from '../../search/models/filter.model';
import { Store } from '@ngrx/store';
import * as fromCarSelectPanel from '../reducers';
import * as carSelectPanel from '../actions/car-select-panel.actions';
import * as fromFilters from '../../filters/reducers';
import { CarsPanelStateChange } from '../models/cars-panel-state-change.model';
import { GenericFilterModel } from '../../filters/models/generic-filter.model';
import { FilterOptionsBySearchTermPayload } from '../../filters/models/filter-payloads.model';
import { LanguageService } from '../../services/language.service';

const selectedCategoryLabel: string = 'suitableVehicle';

@Component({
    selector: 'car-select-panel-common',
    templateUrl: './__mobile__/car-select-panel.component.html',
    styleUrls: ['./__mobile__/styles/car-select-panel.component__.scss']
})
export class CarSelectPanelCommonComponent implements OnInit, OnDestroy {

    @Input() initialSettings: DropdownFilterModel[] = [];
    @Output() onCarSelectPanelChange: EventEmitter<CarsPanelStateChange[]> = new EventEmitter<CarsPanelStateChange[]>();
    carDataArray$: Observable<DropdownFilterModel[]>;
    categoryUrl: string = "";
    navigationSubscription: Subscription = new Subscription();
    destroy$: Subject<boolean> = new Subject<boolean>();
    previousStateJson: string = "";
    initialized: boolean = false;

    constructor(
        private _carSelectPanelService: CarSelectPanelService,
        private _carSelectPanelStore: Store<fromCarSelectPanel.State>,
        private _languageService: LanguageService,
        private _filterStore: Store<fromFilters.State>,
    ) { }

    ngOnInit() {
        this.initialize();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.clearFilter();
    }

    initialize(): void {
        if (!this.initialSettings || !this.initialSettings.length) {
            this.initialSettings = this._carSelectPanelService.getDefaultVehicleFilterSetting();
        }

        this._carSelectPanelStore.dispatch(new carSelectPanel.SetupPanelStateAction(this.initialSettings));
        this.carDataArray$ = this._carSelectPanelStore.select(fromCarSelectPanel.getCarFiltersArray);
        let stopWatch$: Subject<boolean> = new Subject<boolean>();

        this._carSelectPanelStore.select(fromCarSelectPanel.getMostSpecificVehicleFilter)
            .pipe(
                takeUntil(stopWatch$))
            .subscribe(genericFilter => {
                if (!genericFilter) {
                    return;
                }
                stopWatch$.next(true);
                stopWatch$.unsubscribe();
                let key = genericFilter.selectedOptions[0].key;
                let filter: Filter = { key: key, value: '', type: FilterTypesEnum[genericFilter.filterType] };

                let handler = this._carSelectPanelService.GetHandler(filter.type, this._carSelectPanelStore);
                if (handler) {
                    handler.onInit(filter);
                }
            });

        this._carSelectPanelStore.select(fromCarSelectPanel.getVehicleFiltersState).pipe(
            debounceTime(300),
            takeUntil(this.destroy$))
            .subscribe(changes => {
                if (this.stateChanged(changes)) {
                    this.previousStateJson = JSON.stringify(changes);
                    this.onCarSelectPanelChange.emit(changes);
                }
            });

        this._filterStore.select(fromFilters.getCategoryUrl)
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.categoryUrl = result;
            });
    }

    onOptionSelect(option: StrKeyValueModel, filterData: DropdownFilterModel): void {
        filterData.selectedOptions = [option];
        let handler = this._carSelectPanelService.GetHandler(FilterTypesEnum[filterData.filterType], this._carSelectPanelStore);
        if (handler) {
            handler.onSelect(option);
        }
    }

    onFilterClear(filterData: DropdownFilterModel): void {
        filterData.selectedOptions = [];
        let handler = this._carSelectPanelService.GetHandler(FilterTypesEnum[filterData.filterType], this._carSelectPanelStore);
        if (handler) {
            handler.onClear();
        }
    }

    onFilterClick(filterData: DropdownFilterModel): void {
        if (filterData.hasLoaded) {
            return;
        }

        let categoryId = this.getIdFromUrl(this.categoryUrl);

        let handler = this._carSelectPanelService.GetHandler(FilterTypesEnum[filterData.filterType], this._carSelectPanelStore);
        if (handler) {
            handler.onClick(categoryId);
        }
    }

    getPlaceholder(filterData: DropdownFilterModel): string {
        let language = this._languageService.getSelectedLanguage();
        if (language.id === 1) {
            return filterData.titleUkr;
        }
        return filterData.titleRus;
    }

    getSearchString(filterData: DropdownFilterModel): string {
        if (
            filterData.selectedOptions &&
            filterData.selectedOptions.length &&
            filterData.selectedOptions[0].value
        ) {
            return filterData.selectedOptions[0].value;
        }
        return "";
    }

    trackByFn(index, item) {
        return index;
    }

    stateChanged(changes: CarsPanelStateChange[]): boolean {
        return this.previousStateJson != JSON.stringify(changes);
    }

    onInputChange(): void {
        if (!this.initialized) {
            let handler = this._carSelectPanelService.GetHandler(FilterTypesEnum.SuitableVehicles_Mark, this._carSelectPanelStore);
            this.initialized = true;
            handler.onClick();
        }
    }

    public filterDropdownOptions(searchTerm: string, filterData: GenericFilterModel): void {
        const payload: FilterOptionsBySearchTermPayload = {
            filterType: filterData.filterType,
            searchTerm: searchTerm
        }
        this._carSelectPanelStore.dispatch(new carSelectPanel.FilterOptionsBySearchTermAction(payload));
    }

    public clearFilter() {
        this._carSelectPanelStore.dispatch(new carSelectPanel.ClearSelectedMarkAction());
    }

    private getIdFromUrl(url: string): number {
        let startIdx = url.indexOf('-id') + 3;
        let endInx = url.indexOf('-3');
        return Number(url.substring(startIdx, endInx));
    }
}