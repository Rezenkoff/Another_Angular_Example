import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DropdownFilterModel } from '../../filters/models/dropdown-filter.model';
import * as routingParamsService from '../../services/routing-parameters.service';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromFilters from '../reducers';
import * as filtersActions from '../actions/filters.actions';
import * as fromSearch from '../../search/reducers';
import * as search from '../../search/actions/search.actions';
import { CarsPanelStateChange } from '../../car-select-panel/models/cars-panel-state-change.model';
import { GenericFilterSearchParamModel } from '../../filters/models/generic-filter-search-param.model';
import { takeUntil, first } from 'rxjs/operators';
import { CarSelectPanelCommonComponent } from '../../car-select-panel/components/car-select-panel.component';
import { FilterTypesEnum, AppliedOptionModel } from '../models';

const selectedCategoryLabel: string = 'suitableVehicle';

@Component({
    selector: 'car-filter-panel',
    templateUrl: './__mobile__/car-filter-panel.component.html',
    styleUrls: ['./__mobile__/styles/car-filter-panel.component__.scss']
})
export class CarFilterPanelComponent implements OnInit, OnDestroy {

    isEnabled$: Observable<boolean>;
    isCarSelected: boolean = false;
    selectedCarName: string = "";
    carDataArray$: Observable<DropdownFilterModel[]>;
    categoryUrl: string;
    destroy$: Subject<boolean> = new Subject<boolean>();
    @ViewChild(CarSelectPanelCommonComponent) carSelectPanel: CarSelectPanelCommonComponent;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _routingParamsService: routingParamsService.RoutingParametersService,
        private _filterStore: Store<fromFilters.State>,
        private _searchStore: Store<fromSearch.State>,
    ) { }

    ngOnInit() {
        this.carDataArray$ = this._filterStore.select(fromFilters.getCarFiltersArray);
        this.isEnabled$ = this._filterStore.select(fromFilters.isSuitableVehiclesEnabled);
        this.isEnabled$.pipe(takeUntil(this.destroy$)).subscribe(enabled => {
            if (!enabled) {
                return;
            }
            let params = this._activatedRoute.snapshot.params;
            this.categoryUrl = params['urlEnding'] || '';

            this.carDataArray$.pipe(takeUntil(this.destroy$)).subscribe(carsArray => {
                if (this.carSelectPanel) {
                    this.carSelectPanel.initialize();
                }
            });

            this._filterStore.select(fromFilters.getAppliedOptions)
                .pipe(takeUntil(this.destroy$))
                .subscribe(result => {
                    this.generateCarName(result);
                });
        })
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    getPlaceholder(filterData: DropdownFilterModel): string {
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

    navigate(): void {
        this._filterStore.select(fromFilters.getRouteParams).pipe(first()).subscribe(seoRoute => {
            this.isCarSelected = true;
            let routeParams = this._routingParamsService.getRoute(seoRoute);
            this._router.navigate(routeParams.route, routeParams.queryParameters);
        })
    }

    updateCarInfo(changes: CarsPanelStateChange[]): void {
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
        }
    }

    clearFilters() {
        this.carSelectPanel.clearFilter();
    }

    toggleSelectCarArea() {
        this.isCarSelected = false;
    }

    generateCarName(data: AppliedOptionModel[]) {
        data.map(elem => {
            if (FilterTypesEnum[elem.filterType] >= FilterTypesEnum.SuitableVehicles_Mark) {
                this.selectedCarName += `${elem.option.value.toUpperCase()} `;
            }
        });
        if (this.selectedCarName) {
            this.isCarSelected = true;
        }
    }
}