import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromSearch from '../../search/reducers';
import { GenericFilterSearchParamModel } from '../models';
import * as search from '../../search/actions/search.actions';
import * as fromFilters from '../reducers';
import * as routingParamsService from '../../services/routing-parameters.service';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import * as fromCarSelectPanel from '../reducers';
import * as carSelectPanel from '../../car-select-panel/actions/car-select-panel.actions';
import { CarSelectPanelTiresComponent } from '../../car-select-panel/components/car-select-panel-tires.component';

@Component({
    selector: 'car-filter-tires-panel',
    templateUrl: './__mobile__/car-filter-tires-panel.component.html',
    styleUrls: ['./__mobile__/styles/car-filter-tires-panel.component__.scss']
})
export class CarFilterTiresComponent {
    public selectedCar: any[] = [];
    public isCarSelected: boolean = false;
    public needShow: boolean = false;
    public categoryUrl: string;
    destroy$: Subject<boolean> = new Subject<boolean>();
    isEnabled$: Observable<boolean>;
    @Output() public onApplyCar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public onResetCar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public onClearCar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild(CarSelectPanelTiresComponent) carSelectPanelTiresComponent: CarSelectPanelTiresComponent;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _searchStore: Store<fromSearch.State>,
        private _filterStore: Store<fromFilters.State>,
        private _routingParamsService: routingParamsService.RoutingParametersService,
        private _carSelectPanelStore: Store<fromCarSelectPanel.State>
    ) {

    }

    ngOnInit() {
        let params = this._activatedRoute.snapshot.params;
        this.categoryUrl = params['urlEnding'];
        if (this.categoryUrl == "shiny-id49-3") {
            this.needShow = true;
        }
        this.isEnabled$ = this._filterStore.select(fromFilters.isSuitableVehiclesEnabled);
        this.isEnabled$.pipe(takeUntil(this.destroy$)).subscribe(enabled => {
        })
    }

    ngOnDestroy() {
    }

    public CarIsValid(): boolean {
        return this.isCarSelected;
    }
    public arrPointCar: Array<string> = ["SuitableVehicles_Mark", "SuitableVehicles_Model", "SuitableVehicles_Modif"];

    public updateCarInfo(changes: any[]): void {
        this.selectedCar = changes;
        this.isCarSelected = true;

        changes.forEach((x, index) => {
            if (index != 2) {
                let filterSearchParam = new GenericFilterSearchParamModel(this.arrPointCar[index], `${x.value.replace(" ", "_")}-id${x.key}`);
                this._searchStore.dispatch(new search.SetGenericFilterValue(filterSearchParam));
            }
            else {
                let type = x.value == "заводские" ? "zavodskie" : "nazamenu";
                let filterSearchParam = new GenericFilterSearchParamModel(this.arrPointCar[index], `${type}-id${x.key}`);
                this._searchStore.dispatch(new search.SetGenericFilterValue(filterSearchParam));
            }

        });
    }

    navigate(): void {
        if (this.selectedCar.length > 0) {
            this._searchStore.dispatch(new search.ResetFilterOptionTiresCar());
            this.onApplyCar.emit(true);
        }      
    }

    public clearFilters() {
        this.isCarSelected = false;
        this.carSelectPanelTiresComponent.reset();
        this.onResetCar.emit();
    }
}