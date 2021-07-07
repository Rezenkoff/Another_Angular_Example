import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CarSelectPanelService } from '../services/car-select-panel.service';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { CarMark } from '../../cars-catalog/models';
import { Store } from '@ngrx/store';
import * as fromSearch from '../../search/reducers';
import * as fromFilters from '../reducers';
import * as filtersActions from '../../filters/actions/filters.actions';
import { ActivatedRoute } from '@angular/router';

const selectedCategoryLabel: string = 'suitableVehicle';

@Component({
    selector: 'car-select-panel-tires',
    templateUrl: './__mobile__/car-select-panel-tires.component.html',
    styleUrls: ['./__mobile__/styles/car-select-panel-tires.component__.scss']
})
export class CarSelectPanelTiresComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean> = new Subject<boolean>();
    public markList: Array<CarMark> = [];
    public modelsList: Array<CarMark> = [];
    public selectMark: string = '';
    public selectModel: string = '';
    public showDropDownMark: boolean = false;
    public showDropDownModel: boolean = false;
    public param: StrKeyValueModel[] = [];
    @Output() onCarSelectPanelChangeCar: EventEmitter<StrKeyValueModel[]> = new EventEmitter<StrKeyValueModel[]>();
    public selectedType: number = 1;
    public categoryUrl: string;

    constructor(
        private _carSelectPanelService: CarSelectPanelService,
        private _activatedRoute: ActivatedRoute,
        private _searchStore: Store<fromSearch.State>,
        private _filterStore: Store<fromFilters.State>
    ) { }

    ngOnInit() {
        this.initialize();

        this._carSelectPanelService.getMarksPPTires().pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.markList = data;
        });
    }

    private initialize() {
        let params = this._activatedRoute.snapshot.params;
        this.categoryUrl = params['urlEnding'];
        this._filterStore.dispatch(new filtersActions.SetCategoryUrlAction(this.categoryUrl));

        this._searchStore.select(fromSearch.getSearchParameters).pipe(first()).subscribe(sp => {
            let param: string;
            let paramValue: string;
            let paramKey: string;

            for (const key in sp) {
                if (key == "SuitableVehicles_Mark") {
                    param = sp[key][0].split('-id');
                    paramValue = param[0].replace("_", " ");
                    paramKey = param[1];

                    this.selectCarMark(paramKey, paramValue);
                    this.showDropDownMark = false;
                } else if (key == "SuitableVehicles_Model") {
                    param = sp[key][0].split('-id');
                    paramValue = param[0].replace("_", " ");
                    paramKey = param[1];

                    this.selectCarModel(paramKey, paramValue);
                    this.showDropDownModel = false;

                } else if (key == "SuitableVehicles_Modif") {
                    param = sp[key][0].split('-id');
                    paramKey = param[1];
   
                    this.selectedType = parseInt(paramKey);
                    this.chooseType(this.selectedType);
                }
            }
                      
            this._filterStore.dispatch(new filtersActions.LoadFilterSettingsAction(sp));
        });
    }

    public reset() {
        this.selectMark = '';
        this.selectModel = '';
        this.selectedType = 1;

        this.param = [];
        this.onCarSelectPanelChangeCar.emit(this.param);
    }

    public chooseType(id: number) {
        this.selectedType = id;

        let typeKVP = new StrKeyValueModel(this.selectedType.toString(), (this.selectedType === 1 ? "заводские" : "на замену"));
        this.param[2] = typeKVP;

        if (this.selectMark != '' && this.selectModel != '') {
            this.onCarSelectPanelChangeCar.emit(this.param);
        }
        
    }
    public getMarkList(markList: any[]): any[] {

        if (this.markList != null) {
            if (this.selectMark != '') {
                return markList.filter(param => param.value.toUpperCase().includes(this.selectMark.toUpperCase()));
            }
            return markList;
        }

        return [];
    }

    public getModelList(modelsList: any[]): any[] {
        if (this.modelsList != null) {
            if (this.selectModel != '') {
                return modelsList.filter(param => param.value.toUpperCase().includes(this.selectModel.toUpperCase()));
            }
            return modelsList;
        }

        return [];
    }

    public selectCarMark(markKey: string, markValue: string): void {
        this.selectMark = markValue;
        this.toggleDropdownCarMark(false);
        let markKVP = new StrKeyValueModel(markKey, markValue);       
        this.param[0] = markKVP;

        this._carSelectPanelService.getModelsByMarksPPTires(markKey).pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.modelsList = data;
        });
    }

    public selectCarModel(modelKey: string, modelValue: string): void {

        this.selectModel = modelValue;
        this.toggleDropdownCarModel(false);

        let modelKVP = new StrKeyValueModel(modelKey, modelValue);
        this.param[1] = modelKVP;

        let typeKVP = new StrKeyValueModel(this.selectedType.toString(), (this.selectedType === 1 ? "заводские" : "на замену" ));
        this.param[2] = typeKVP;

        this.onCarSelectPanelChangeCar.emit(this.param);
    }

    public toggleDropdownCarMark(clear: boolean): void {
        if (this.selectModel != '') {
            this.reset();
        }
        this.showDropDownMark = !this.showDropDownMark;
        this.showDropDownModel = false;
        if (clear) {
            this.selectMark = '';
        }
    }

    public toggleDropdownCarModel(clear: boolean): void {
        this.showDropDownMark = false;
        this.showDropDownModel = !this.showDropDownModel;
        if (clear) {
            this.selectModel = '';
        }
    }

    ngOnDestroy() {
        this._filterStore.dispatch(new filtersActions.SetCategoryUrlAction(''));
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}