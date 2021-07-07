import { Action } from '@ngrx/store';
import { CarExtended } from '../../cars-catalog/models/car-extended.model';
import { CarMark } from '../../cars-catalog/models/car-mark.model';
import { CarSerie } from '../../cars-catalog/models/car-serie.model';
import { CarModel } from '../../cars-catalog/models/car-model.model';
import { StrKeyValueModel  } from '../../models/key-value-str.model';
import { CarsPanelStateChange } from '../models/cars-panel-state-change.model';
import { DropdownFilterModel } from '../../filters/models/dropdown-filter.model';
import { BooleanFilterPayload } from '../../filters/models/filter-payloads.model';
import { FilterOptionsBySearchTermPayload } from '../../filters/models/filter-payloads.model';


export const SETUP_PANEL_STATE = '[CarSelectPanelState] setup initial panel state';

export const SET_MARK_REQUEST_PARAMS = '[CarSelectPanelState] set mark request params in store';
export const SET_SERIE_REQUEST_PARAMS = '[CarSelectPanelState] set series request params in store';
export const SET_YEAR_REQUEST_PARAMS = '[CarSelectPanelState] set series request params in store';
export const SET_MODEL_REQUEST_PARAMS = '[CarSelectPanelState] set models request params in store';
export const SET_MODIF_REQUEST_PARAMS = '[CarSelectPanelState] set modifs request params in store';

export const INIT_BY_MARK = '[CarSelectPanelState] fill essential info by mark';
export const INIT_BY_SERIE = '[CarSelectPanelState] fill essential info by serie';
export const INIT_BY_MODEL = '[CarSelectPanelState] fill essential info by model';
export const INIT_BY_MODIF = '[CarSelectPanelState] fill essential info by modif';

export const LOAD_MARKS = '[CarSelectPanelState] Load marks info';
export const LOAD_SERIES = '[CarSelectPanelState] Load series info';
export const LOAD_MODELS = '[CarSelectPanelState] Load models info';
export const LOAD_MODIFS = '[CarSelectPanelState] Load modifs info';

export const LOAD_ERROR = '[CarSelectPanelState] Error during load'

export const CANCEL_LOAD_MARKS = '[CarSelectPanelState] Cancel load marks';
export const CANCEL_LOAD_SERIES = '[CarSelectPanelState] Cancel load series';
export const CANCEL_LOAD_MODELS = '[CarSelectPanelState] Cancel load models';
export const CANCEL_LOAD_MODIFS = '[CarSelectPanelState] Cancel load modifs';

export const SET_MARKS_OPTIONS = '[CarSelectPanelState] Set marks options';
export const SET_SERIES_OPTIONS = '[CarSelectPanelState] Set series options';
export const SET_YEARS_OPTIONS = '[CarSelectPanelState] Set years options';
export const SET_MODELS_OPTIONS = '[CarSelectPanelState] Set models options';
export const SET_MODIFS_OPTIONS = '[CarSelectPanelState] Set modifs options';

export const SELECT_MARK = '[CarSelectPanelState] Click on mark';
export const SELECT_SERIE = '[CarSelectPanelState] Click on serie';
export const SELECT_YEAR = '[CarSelectPanelState] Click on year';
export const SELECT_MODEL = '[CarSelectPanelState] Click on model';
export const SELECT_MODIF = '[CarSelectPanelState] Click on modif';

export const CLEAR_MARK = '[CarSelectPanelState] Clear selected mark';
export const CLEAR_SERIE = '[CarSelectPanelState] Clear selected serie';
export const CLEAR_YEAR = '[CarSelectPanelState] Clear selected year';
export const CLEAR_MODEL = '[CarSelectPanelState] Clear selected model';
export const CLEAR_MODIF = '[CarSelectPanelState] Clear selected modif';

export const SET_SELECTED_MARK = '[CarSelectPanelState] Set selected mark';
export const SET_SELECTED_SERIE = '[CarSelectPanelState] Set selected serie';
export const SET_SELECTED_YEAR = '[CarSelectPanelState] Set selected year';
export const SET_SELECTED_MODEL = '[CarSelectPanelState] Set selected model';
export const SET_SELECTED_MODIF = '[CarSelectPanelState] Set selected modif';

export const SET_SERIE_INPUT_STATE = '[CarSelectPanelState] Set serie dropdown active/inactive';
export const SET_YEAR_INPUT_STATE = '[CarSelectPanelState] Set year dropdown active/inactive';
export const SET_MODEL_INPUT_STATE = '[CarSelectPanelState] Set model dropdown active/inactive';
export const SET_MODIF_INPUT_STATE = '[CarSelectPanelState] Set modif dropdown active/inactive';

export const SET_GENERIC_DROPDOWN_STATE = '[CarSelectPanelState] Set dropdown active/inactive';
export const SET_GENERIC_FILTER_LOAD_STATE = '[CarSelectPanelState] Set dropdown loading true/false';

export const SET_CHANGES_DELTA = '[CarSelectPanelState] Set changes delta';
export const FILTER_OPTIONS_BY_SEARCH_TERM = '[CarSelectPanelState] filter options by search term';

export class InitByMarkAction implements Action {
    readonly type = INIT_BY_MARK;

    constructor(public payload: string) { }
} 

export class InitBySerieAction implements Action {
    readonly type = INIT_BY_SERIE;

    constructor(public payload: string) { }
} 

export class InitByModelAction implements Action {
    readonly type = INIT_BY_MODEL;

    constructor(public payload: string) { }
} 

export class InitByModifAction implements Action {
    readonly type = INIT_BY_MODIF;

    constructor(public payload: string) { }
} 

export class SetMarkRequestParamsAction implements Action {
    readonly type = SET_MARK_REQUEST_PARAMS;

    constructor(public payload: string) { }
} 

export class SetSerieRequestParamsAction implements Action {
    readonly type = SET_SERIE_REQUEST_PARAMS;

    constructor(public payload: string) { }
} 

export class SetYearRequestParamsAction implements Action {
    readonly type = SET_YEAR_REQUEST_PARAMS;

    constructor(public payload: string) { }
} 

export class SetModelRequestParamsAction implements Action {
    readonly type = SET_MODEL_REQUEST_PARAMS;

    constructor(public payload: string) { }
} 

export class SetModifRequestParamsAction implements Action {
    readonly type = SET_MODIF_REQUEST_PARAMS;

    constructor(public payload: string) { }
} 

export class LoadMarksAction implements Action {
    readonly type = LOAD_MARKS;

    constructor(public payload?: number) { }
}

export class LoadSeriesAction implements Action {
    readonly type = LOAD_SERIES;

    constructor(public payload?: number) { }
}

export class LoadModelsAction implements Action {
    readonly type = LOAD_MODELS;

    constructor() { }
}

export class LoadModifsAction implements Action {
    readonly type = LOAD_MODIFS;

    constructor() { }
}

export class LoadErrorAction implements Action {
    readonly type = LOAD_ERROR;

    constructor() { }
}

export class CancelLoadMarksAction implements Action {
    readonly type = CANCEL_LOAD_MARKS;

    constructor() { }
}

export class CancelLoadSeriesAction implements Action {
    readonly type = CANCEL_LOAD_SERIES;

    constructor() { }
}

export class CancelLoadModelsAction implements Action {
    readonly type = CANCEL_LOAD_MODELS;

    constructor() { }
}

export class CancelLoadModifsAction implements Action {
    readonly type = CANCEL_LOAD_MODIFS;

    constructor() { }
}

export class SetMarksOptionsAction implements Action {
    readonly type = SET_MARKS_OPTIONS;

    constructor(public payload: CarMark[]) { }
}

export class SetSeriesOptionsAction implements Action {
    readonly type = SET_SERIES_OPTIONS;

    constructor(public payload: CarSerie[]) { }
}

export class SetYearsOptionsAction implements Action {
    readonly type = SET_YEARS_OPTIONS;

    constructor(public payload: CarExtended[]) { }
}

export class SetModelsOptionsAction implements Action {
    readonly type = SET_MODELS_OPTIONS;

    constructor(public payload: CarModel[]) { }
}

export class SetModifsOptionsAction implements Action {
    readonly type = SET_MODIFS_OPTIONS;

    constructor(public payload: CarExtended[]) { }
}

export class SetSelectedMarkAction implements Action {
    readonly type = SET_SELECTED_MARK;

    constructor(public payload: StrKeyValueModel) { }
}

export class SetSelectedSerieAction implements Action {
    readonly type = SET_SELECTED_SERIE;

    constructor(public payload: StrKeyValueModel) { }
}

export class SetSelectedYearAction implements Action {
    readonly type = SET_SELECTED_YEAR;

    constructor(public payload: StrKeyValueModel) { }
}

export class SetSelectedModelAction implements Action {
    readonly type = SET_SELECTED_MODEL;

    constructor(public payload: StrKeyValueModel) { }
}

export class SetSelectedModifAction implements Action {
    readonly type = SET_SELECTED_MODIF;

    constructor(public payload: StrKeyValueModel) { }
}

export class ClearSelectedMarkAction implements Action {
    readonly type = CLEAR_MARK;

    constructor() { }
}

export class ClearSelectedSerieAction implements Action {
    readonly type = CLEAR_SERIE;

    constructor() { }
}

export class ClearSelectedYearAction implements Action {
    readonly type = CLEAR_YEAR;

    constructor() { }
}

export class ClearSelectedModelAction implements Action {
    readonly type = CLEAR_MODEL;

    constructor() { }
}


export class ClearSelectedModifAction implements Action {
    readonly type = CLEAR_MODIF;

    constructor() { }
}


export class SetSerieInputStateAction implements Action {
    readonly type = SET_SERIE_INPUT_STATE;

    constructor(public payload: boolean) { }
}

export class SetYearInputStateAction implements Action {
    readonly type = SET_YEAR_INPUT_STATE;

    constructor(public payload: boolean) { }
}

export class SetModelInputStateAction implements Action {
    readonly type = SET_MODEL_INPUT_STATE;

    constructor(public payload: boolean) { }
}

export class SetModifInputStateAction implements Action {
    readonly type = SET_MODIF_INPUT_STATE;

    constructor(public payload: boolean) { }
}

export class SelectMarkAction implements Action {
    readonly type = SELECT_MARK;

    constructor(public payload: StrKeyValueModel) { }
}

export class SelectSerieAction implements Action {
    readonly type = SELECT_SERIE;

    constructor(public payload: StrKeyValueModel) { }
}

export class SelectYearAction implements Action {
    readonly type = SELECT_YEAR;

    constructor(public payload: StrKeyValueModel) { }
}

export class SelectModelAction implements Action {
    readonly type = SELECT_MODEL;

    constructor(public payload: StrKeyValueModel) { }
}

export class SelectModifAction implements Action {
    readonly type = SELECT_MODIF;

    constructor(public payload: StrKeyValueModel) { }
}

export class SetGenericDropdownStateAction implements Action {
    readonly type = SET_GENERIC_DROPDOWN_STATE;

    constructor(public payload: BooleanFilterPayload) { }
}

export class SetGenericDropdownLoadStateAction implements Action {
    readonly type = SET_GENERIC_FILTER_LOAD_STATE;

    constructor(public payload: BooleanFilterPayload) { }
}

export class SetupPanelStateAction implements Action {
    readonly type = SETUP_PANEL_STATE;

    constructor(public payload: DropdownFilterModel[]) { }
}

export class SetChangesDeltaAction implements Action {
    readonly type = SET_CHANGES_DELTA;

    constructor(public payload: CarsPanelStateChange) { }
}

export class FilterOptionsBySearchTermAction implements Action {
    readonly type = FILTER_OPTIONS_BY_SEARCH_TERM;

    constructor(public payload: FilterOptionsBySearchTermPayload) { }
}

export type Actions =
    InitByMarkAction
    | InitBySerieAction
    | InitByModelAction
    | InitByModifAction
    | SetMarkRequestParamsAction
    | SetSerieRequestParamsAction
    | SetYearRequestParamsAction
    | SetModelRequestParamsAction
    | SetModifRequestParamsAction
    | LoadMarksAction
    | LoadSeriesAction
    | LoadModelsAction
    | LoadModifsAction
    | LoadErrorAction
    | CancelLoadMarksAction
    | CancelLoadSeriesAction
    | CancelLoadModelsAction
    | CancelLoadModifsAction
    | SetMarksOptionsAction
    | SetSeriesOptionsAction
    | SetYearsOptionsAction
    | SetModelsOptionsAction
    | SetModifsOptionsAction
    | SetSelectedMarkAction
    | SetSelectedSerieAction
    | SetSelectedYearAction
    | SetSelectedModelAction
    | SetSelectedModifAction
    | ClearSelectedMarkAction
    | ClearSelectedSerieAction
    | ClearSelectedYearAction
    | ClearSelectedModelAction
    | ClearSelectedModifAction
    | SetSerieInputStateAction
    | SetYearInputStateAction
    | SetModelInputStateAction
    | SetModifInputStateAction
    | SelectMarkAction
    | SelectSerieAction
    | SelectYearAction
    | SelectModelAction
    | SelectModifAction
    | SetGenericDropdownLoadStateAction
    | SetGenericDropdownStateAction
    | SetupPanelStateAction
    | SetChangesDeltaAction
    | FilterOptionsBySearchTermAction
    ;