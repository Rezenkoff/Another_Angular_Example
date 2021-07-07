import { GenericFilterSearchParamModel } from '../../filters/models/generic-filter-search-param.model';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import { Filter } from '../../search/models/filter.model';
import { Store } from '@ngrx/store';
import * as fromCarSelectPanel from '../reducers';
import * as carSelectPanel from '../actions/car-select-panel.actions';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';

const markKey: string = CarFilterKeys.markKey;
const serieKey: string = CarFilterKeys.serieKey;
const yearKey: string = CarFilterKeys.yearKey;
const modelKey: string = CarFilterKeys.modelKey;
const modifKey: string = CarFilterKeys.modifKey;

export interface ICarSelectPanelHandler {
    onInit(filter: Filter): void;
    onSelect(option: StrKeyValueModel): void;
    onClick(categoryId?: number): void;
    onClear(): void;
}

export abstract class CarSelectPanelHandler implements ICarSelectPanelHandler{
    constructor(
        public store: Store<fromCarSelectPanel.State>        
    ) { }
    onInit(filter: Filter): void { };    
    abstract onSelect(option: StrKeyValueModel): void;
    onClick(categoryId?: number): void { };
    abstract onClear(): void;
}

export class MarkHandler extends CarSelectPanelHandler {    

    public onInit(filter: Filter): void {        
        this.store.dispatch(new carSelectPanel.InitByMarkAction(filter.key));
    }

    public onSelect(option: StrKeyValueModel): void {
        let type = markKey;
        this.store.dispatch(new carSelectPanel.SelectMarkAction(option));  
        let filterSearchParam = new GenericFilterSearchParamModel(type, option.key);
    }

    public onClear(): void {
        this.store.dispatch(new carSelectPanel.ClearSelectedMarkAction());
    }

    public onClick(categoryId?: number): void {
        this.store.dispatch(new carSelectPanel.SetGenericDropdownStateAction({ filterType: markKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: markKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.LoadMarksAction(categoryId));
    }
}

export class SerieHandler extends CarSelectPanelHandler {

    public onInit(filter: Filter): void {
        this.store.dispatch(new carSelectPanel.InitBySerieAction(filter.key));
    }

    public onSelect(option: StrKeyValueModel): void{
        let type = serieKey;
        this.store.dispatch(new carSelectPanel.SelectSerieAction(option));
    }

    public onClear(): void {
        this.store.dispatch(new carSelectPanel.ClearSelectedSerieAction());
    }

    public onClick(categoryId?: number): void {
        this.store.dispatch(new carSelectPanel.SetGenericDropdownStateAction({ filterType: serieKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: serieKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.LoadSeriesAction(categoryId));
    }
}

export class ModelHandler extends CarSelectPanelHandler {

    public onInit(filter: Filter): void {
        this.store.dispatch(new carSelectPanel.InitByModelAction(filter.key));
    }

    public onSelect(option: StrKeyValueModel): void {
        let type = modelKey;
        this.store.dispatch(new carSelectPanel.SelectModelAction(option));
    }

    public onClick(): void {
        this.store.dispatch(new carSelectPanel.SetGenericDropdownStateAction({ filterType: modelKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: modelKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.LoadModelsAction());
    }

    public onClear(): void {
        this.store.dispatch(new carSelectPanel.ClearSelectedModelAction());
    }
}

export class YearHandler extends CarSelectPanelHandler {

    public onSelect(option: StrKeyValueModel): void {
        let type = yearKey;
        this.store.dispatch(new carSelectPanel.SelectYearAction(option));
        let filterSearchParam = new GenericFilterSearchParamModel(type, option.key);
    }

    public onClick(): void {
        this.store.dispatch(new carSelectPanel.SetGenericDropdownStateAction({ filterType: yearKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: yearKey, boolValue: true }));
        this.store.dispatch(new carSelectPanel.LoadModifsAction());        
    }

    public onClear(): void {
        this.store.dispatch(new carSelectPanel.ClearSelectedYearAction());
    }
}

export class ModifHandler extends CarSelectPanelHandler {

    public onInit(filter: Filter): void {
        this.store.dispatch(new carSelectPanel.InitByModifAction(filter.key));
    }

    public onSelect(option: StrKeyValueModel): void {
        this.store.dispatch(new carSelectPanel.SelectModifAction(option));
    }

    public onClick(): void {
        this.store.dispatch(new carSelectPanel.LoadModifsAction()); 
        this.store.dispatch(new carSelectPanel.SetGenericDropdownStateAction({ filterType: modifKey, boolValue: true }));
    }

    public onClear(): void {
        this.store.dispatch(new carSelectPanel.ClearSelectedModifAction());
    }
}