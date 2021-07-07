import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterTypesEnum } from '../models';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import { Router } from '@angular/router';
import { ComboboxFilterModel } from '../models';

const maxOptionsSize: number = 100;

@Component({
    selector: 'filter-combobox',
    templateUrl: './__mobile__/filter-combobox.component.html',
    styleUrls: ['./__mobile__/styles/filter-combobox.component__.scss']
})

export class FilterComboboxComponent {

    @Input() public filterData: ComboboxFilterModel;
    @Input() public language: string;

    @Output() onChageFilter: EventEmitter<StrKeyValueModel> = new EventEmitter<StrKeyValueModel>();
    @Output() onFilterClearEvent: EventEmitter<StrKeyValueModel> = new EventEmitter<StrKeyValueModel>();
    @Output() onOptionsRequest: EventEmitter<ComboboxFilterModel> = new EventEmitter<ComboboxFilterModel>();

    public filterSearchString: string = "";
    private fullOptionsList: StrKeyValueModel[] = [];
    private timeoutId: any;
    public isCollapsed: boolean = false;

    constructor(        
        private _router: Router     
    ) { } 

    public searchFilterOptions(): void {        
        if (!this.fullOptionsList.length && this.filterData.options) {
            this.fullOptionsList = [...this.filterData.options];
        }
        if (this.needsServerSearch()) {
            this.callServerSearch();
        }
        this.filterData.options = this.fullOptionsList.filter(x =>
            x.value.toLowerCase().includes(this.filterSearchString.toLowerCase()));
    }

    private onOptionClear(option: StrKeyValueModel): void {        
        this.onFilterClearEvent.emit(option);        
    }

    private changeOptionState(option: StrKeyValueModel): void {        
        if (this.isOptionChecked(option)) {
            this.onOptionClear(option);
            return;
        }
        this.onChageFilter.emit(option);        
    }

    public getRouteParams(option: StrKeyValueModel): string[] {
        if (this.filterData.routesDict &&
            this.filterData.routesDict[option.key] &&
            this.filterData.routesDict[option.key].route) {
            return this.filterData.routesDict[option.key].route;
        }
        return [];
    }

    public getQueryParams(option: StrKeyValueModel): Object { 
        if (this.filterData.routesDict &&
            this.filterData.routesDict[option.key] &&
            this.filterData.routesDict[option.key].queryParameters &&
            !this.isEmptyObject(this.filterData.routesDict[option.key].queryParameters.queryParams)) {
            return this.filterData.routesDict[option.key].queryParameters.queryParams;
        }
        return null; 
    }

    public isOptionChecked(option: StrKeyValueModel): boolean {
        if (!this.filterData.selectedOptions ||
            !this.filterData.selectedOptions.length
        ) {
            return false;
        }
        let selected = this.filterData.selectedOptions.find(o => o.key == option.key);
        return Boolean(selected);
    }

    public getTitle(): string {
        return (this.language === 'UKR') ?
            this.filterData.titleUkr :
            this.filterData.titleRus;
    }

    private displayUrl(): boolean {
        return this.filterData.isPromoted;
    }

    private navigateToFiltered(option: StrKeyValueModel): void {
        let routeParams = this.getRouteParams(option);
        let queryParams = this.getQueryParams(option);
        this.filterSearchString = '';
        this._router.navigate(routeParams, { queryParams: queryParams });
    }

    private isEmptyObject(obj: Object): boolean {
        if (!obj) {
            return false;
        }
        return (Object.getOwnPropertyNames(obj).length === 0);
    }

    private needsServerSearch(): boolean {
        // keyword returns empty result for "Tire_FrameSize". Seems to work correct only for manufacturers
        //TODO: need to fix bug on PP side
        let len = this.fullOptionsList.length >= maxOptionsSize;
        return Boolean(this.isManufacturerFilter(this.filterData) &&
            this.fullOptionsList.length >= maxOptionsSize);
    }

    private isManufacturerFilter(filterData: ComboboxFilterModel): boolean {
        let typeId: number = FilterTypesEnum[filterData.filterType];
        return Boolean(FilterTypesEnum.Uncategorized_Manufacturer <= typeId &&
            typeId < FilterTypesEnum.SuitableVehicles_Mark);
    }

    private callServerSearch(): void {
        clearTimeout(this.timeoutId);
        this.filterData.keyword = this.filterSearchString;
        this.timeoutId = setTimeout(() => this.onOptionsRequest.emit(this.filterData), 800);
    }

    public isLoading(): boolean {        
        return this.filterData.loading;
    }

    public toggleCollapse(): void {
        this.isCollapsed = !this.isCollapsed;
    }
}
