import { Component, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchParameters } from '../../../search/models/search-parameters.model';
import * as search from '../../../search/actions/search.actions';
import * as fromSearch from '../../../search/reducers';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { SortOptionsModel } from '../../../search/models/sort-options.model';
import { SortOrderEnum } from '../../../search/models/sort-order.enum';

@Component({
    selector: 'search-parameters-panel',
    templateUrl: './__mobile__/search-parameters-panel.component.html',
    styleUrls: ['./__mobile__/styles/search-parameters-panel.component__.scss']
})
export class SearchParametersPanelComponent implements OnInit {

    @Output()
    isListChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    parametersChanged: EventEmitter<void> = new EventEmitter<void>();
    public options;
    public isList: boolean = false;
    public searchParameters: SearchParameters = new SearchParameters();
    public selectedOption: string = 'byDefault';
    public sortOptionsDict: {} = {};

    constructor(
        private searchStore: Store<fromSearch.State>,
        @Inject(APP_CONSTANTS) private _appconstants: IAppConstants  
    ) {
        this.options = this._appconstants.SEARCH.SORT_OPTIONS;
        this.setOptionsDict();
    }

    ngOnInit() {        
        this.searchStore.select(fromSearch.getSearchParameters)
            .subscribe(searchParams => {
                this.searchParameters = searchParams;
                if (!searchParams.sortField && !searchParams.sortOrder) {
                    return;
                }
                this.setSelectedOption();
            });
    }

    public setListClass(isListClass: boolean) {
        this.isList = isListClass;
        this.isListChanged.emit(isListClass);
    }

    public setSortByDisplayDescr(option: string) {
        let sortOption: SortOptionsModel = this.sortOptionsDict[option] || this.sortOptionsDict['byDefault'];
        this.searchStore.dispatch(new search.SetSortFields(sortOption));
        this.search();
    }

    setPageSize(size: number) {
        if (!size) {
            return;
        }
        this.searchStore.dispatch(new search.SetPageSize(size));        
        this.search();
    }

    public setFormFactor(formFactor: number): void {
        this.searchStore.dispatch(new search.SetFormFactor(formFactor));
        this.search();
    }

    public search() {
        this.parametersChanged.emit();
    }

    private setSelectedOption(): void {
        for (let prop in this.sortOptionsDict) {
            let option = this.sortOptionsDict[prop] as SortOptionsModel;
            if (this.searchParameters.sortField == option.sortField &&
                this.searchParameters.sortOrder == option.sortOrder
            ) {
                this.selectedOption = prop;
            }
        }   
    }

    private setOptionsDict(): void {
        this.sortOptionsDict = {
            byDefault: { sortField: this.options.byDefault, sortOrder: SortOrderEnum.Ascending } as SortOptionsModel,
            byPriceAsc: { sortField: this.options.byPrice, sortOrder: SortOrderEnum.Ascending } as SortOptionsModel,
            byPriceDesc: { sortField: this.options.byPrice, sortOrder: SortOrderEnum.Descending } as SortOptionsModel,
            byNameAsc: { sortField: this.options.byName, sortOrder: SortOrderEnum.Ascending } as SortOptionsModel,
            byNameDesc: { sortField: this.options.byName, sortOrder: SortOrderEnum.Descending } as SortOptionsModel,
            byBrandAsc: { sortField: this.options.byBrand, sortOrder: SortOrderEnum.Ascending } as SortOptionsModel,
            byBrandDesc: { sortField: this.options.byBrand, sortOrder: SortOrderEnum.Descending } as SortOptionsModel
        }
    }
}
