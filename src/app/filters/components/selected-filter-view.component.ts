import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromFilters from '../../filters/reducers';
import * as fromSearch from '../reducers';
import * as search from '../../search/actions/search.actions';
import * as filter from '../actions/filters.actions';
import { GenericFilterSearchParamModel, AppliedOptionModel, FilterTypesEnum, AppliedOptionsModel } from "../models";
import { LanguageService } from "../../services/language.service";
import { Language } from "../../models";
import * as fromCarSelectPanel from '../../car-select-panel/reducers/index';
import * as carSelectPanel from '../../car-select-panel/actions/car-select-panel.actions';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SearchParameters } from "../../search/models";

@Component({
    selector: 'selected-filter-view',
    templateUrl: './__mobile__/selected-filter-view.component.html',
    styleUrls: ['./__mobile__/styles/selected-filter-view.component__.scss']
})

export class SelectedFilterView implements OnInit {

    public filterLeftBar: Array<AppliedOptionsModel> = [];
    public language: Language = new Language({ name: 'RUS', id: 2, icon: 'flag-russian.png' });
    public carFilterSelected: string = '';
    private destroy$: Subject<boolean> = new Subject<boolean>();
    @Output() public onFilterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    public selectedFilters: AppliedOptionModel[] = [];

    constructor(
        private filterStore: Store<fromFilters.State>,
        private searchStore: Store<fromSearch.State>,
        private _languageService: LanguageService,
        public store: Store<fromCarSelectPanel.State>
    ) { }

    ngOnInit() {
        this.language = this._languageService.getSelectedLanguage();
        this.filterStore.select(fromFilters.getAppliedOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.clearObj();
                this.generateFilter(result);
            });

    }

    public resetFilters() {
        this.searchStore.dispatch(new search.ResetFilterOption());
        this.applyChanges();
    }

    public applyChanges() {
        this.onFilterChange.emit(true);
    }

    public removeRange(filterData: AppliedOptionsModel) {
        filterData.options.forEach(x => {
            let filterSearchParam = new GenericFilterSearchParamModel(filterData.filterType, x.key);
            this.filterStore.dispatch(new filter.UncheckGenericFilterOptionAction({ filterType: filterData.filterType, options: [x] }));
            this.searchStore.dispatch(new search.RemoveGenericFilterValue(filterSearchParam));
        });
        this.applyChanges();
    }

    public getFilterValue(model: AppliedOptionsModel) {
        return model.options.map(x => x.value).join(', ');
    }

    public generateFilter(data: AppliedOptionModel[]) {
        this.filterLeftBar = [];
        let selectedFilters = data.filter(x => FilterTypesEnum[x.filterType] < FilterTypesEnum.SuitableVehicles_Mark);
        selectedFilters.map(x => {
            let filter = this.filterLeftBar.find(z => z.filterType === x.filterType)
            if (filter) {
                filter.options.push(x.option);
            }
            else {
                let newFilter = new AppliedOptionsModel()
                newFilter.filterNameRus = x.filterNameRus;
                newFilter.filterNameUkr = x.filterNameUkr;
                newFilter.filterType = x.filterType;
                newFilter.options.push(x.option);
                this.filterLeftBar.push(newFilter);
            }
        });
    }

    public onClearCar(): void {
        this.store.dispatch(new carSelectPanel.ClearSelectedMarkAction());
        setTimeout(() => {
            this.applyChanges();
        }, 300);
    }

    private clearObj() {
        this.filterLeftBar = [];
        this.carFilterSelected = '';
    }

    ngOnDestroy() {
        this.searchStore.dispatch(new search.ResetFilterOption());
        this.filterStore.dispatch(new filter.SyncWithSearchParametersAction(new SearchParameters()))
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}