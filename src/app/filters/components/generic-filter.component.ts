import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Observable, Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromSearch from '../../search/reducers';
import * as search from '../../search/actions/search.actions';
import * as fromFilters from '../reducers';
import * as filtersActions from '../actions/filters.actions';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import {
    GenericFilterModel,    
    GenericFilterSearchParamModel,
    DropdownFilterModel,
    ComboboxFilterModel,
    OptionsRequestPayload,
    FilterOptionsBySearchTermPayload
} from '../models';


@Component({
    selector: 'generic-filter',
    templateUrl: './__mobile__/generic-filter.component.html',
    styleUrls: ['./__mobile__/styles/generic-filter.component__.scss']
})
export class GenericFilterComponent implements OnInit, OnDestroy {

    @Output()
    public onFilterClearEvent: EventEmitter<void> = new EventEmitter<void>();
          
    private selectedLanguage: string = "RUS";  
    private subscriptionsList: Subscription[] = [];
    private lastChangedFilter: string = "";

    public comboboxes$: Observable<GenericFilterModel[]>;
    public dropdowns$: Observable<DropdownFilterModel[]>;

    constructor(        
        private _languageService: LanguageService,
        private _searchStore: Store<fromSearch.State>,
        private _filterStore: Store<fromFilters.State>
    ) { }

    ngOnInit() {
        this.comboboxes$ = this._filterStore.select(fromFilters.getComboboxesArray);
        this.dropdowns$ = this._filterStore.select(fromFilters.getDropdownsArray);

        this.setSelectedLanguage();
        this.subscriptionsList.push(this._languageService.languageChange.subscribe(() =>
            this.setSelectedLanguage()));         
    }

    ngOnDestroy() {
        this.subscriptionsList.forEach(s => s.unsubscribe());
    }

    public getComboboxOptions(filterData: ComboboxFilterModel): void {
        this._filterStore.dispatch(new filtersActions.SetGenericDropdownLoadStateAction({ filterType: filterData.filterType, boolValue: true })); 
        this._searchStore.dispatch(new search.SetKeyword(filterData.keyword)); 
        this.getOptionsPayload(filterData).pipe(first()).subscribe(payload => {            
            this._filterStore.dispatch(new filtersActions.LoadComboboxOptionsAction(payload));            
            this._searchStore.dispatch(new search.SetKeyword(''));
       });  
    }

    public getDropdownOptions(filterData: GenericFilterModel): void {        
        if (!this.filterOptionsReloadNeeded(filterData)) {
            return;
        }
        this._filterStore.dispatch(new filtersActions.SetGenericDropdownLoadStateAction({ filterType: filterData.filterType, boolValue: true })); 
        this.getOptionsPayload(filterData).pipe(first()).subscribe(payload => {            
            this._filterStore.dispatch(new filtersActions.LoadFilterOptionsAction(payload));            
        });  
    }

    public filterDropdownOptions(searchTerm: string, filterData: GenericFilterModel): void {
        const payload: FilterOptionsBySearchTermPayload = {
            filterType: filterData.filterType,
            searchTerm: searchTerm
        }
        this._filterStore.dispatch(new filtersActions.FilterOptionsBySearchTermAction(payload));
    }

    public getOptionsPayload(filterData: GenericFilterModel): Observable<OptionsRequestPayload> {
        return this._searchStore.select(fromSearch.getSearchParameters).pipe(first(), map(searchParams => {
            return {
                filterType: filterData.filterType,
                selectedCategory: filterData.selectedCategoryLabel,
                searchParameters: searchParams
            }            
        }));  
    }

    public getFilterTitle(filter: GenericFilterModel): string {
        return (this.selectedLanguage === "RUS") ?
            filter.titleRus :
            filter.titleUkr;
    }

    private setSelectedLanguage(): void {
        let lang = this._languageService.getSelectedLanguage();
        this.selectedLanguage = (lang) ? lang.name : "RUS";
    }

    public onDropdownItemSelect(item: StrKeyValueModel, filter: GenericFilterModel) {    
        this.lastChangedFilter = filter.filterType;
        let filterSearchParam = new GenericFilterSearchParamModel(filter.filterType, item.key);
        this._filterStore.dispatch(new filtersActions.SetSelectedDropdownOptionAction({ filterType: filter.filterType, options: [item] }));
        this._searchStore.dispatch(new search.SetGenericFilterValue(filterSearchParam));        
    }

    public onComboboxItemSelect(item: StrKeyValueModel, filter: GenericFilterModel) {
        this.lastChangedFilter = filter.filterType;
        let filterSearchParam = new GenericFilterSearchParamModel(filter.filterType, item.key);
        this._filterStore.dispatch(new filtersActions.SetSelectedComboboxOptionAction({ filterType: filter.filterType, options: [item] }));
        this._searchStore.dispatch(new search.UpsertGenericFilterValue(filterSearchParam));
    }

    public onFilterClear(item: StrKeyValueModel, filter: GenericFilterModel) {
        let filterSearchParam = new GenericFilterSearchParamModel(filter.filterType, item.key);
        this._filterStore.dispatch(new filtersActions.UncheckGenericFilterOptionAction({ filterType: filter.filterType, options: [item] }));
        this._searchStore.dispatch(new search.RemoveGenericFilterValue(filterSearchParam));
        this.onFilterClearEvent.emit();
    }

    private filterOptionsReloadNeeded(filterData: GenericFilterModel): boolean {
        return !filterData.hasLoaded || filterData.filterType !== this.lastChangedFilter;
    }

    private getSearchString(filterData: DropdownFilterModel): string {
        if (
            filterData.selectedOptions &&
            filterData.selectedOptions.length &&
            filterData.selectedOptions[0].value
        ) {
            return filterData.selectedOptions[0].value;
        }
        return "";
    }

    public trackByFn(index, item) {
        return index;
    }
}