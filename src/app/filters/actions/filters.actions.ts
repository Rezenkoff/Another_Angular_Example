import { Action } from '@ngrx/store';
import { SearchParameters } from '../../search/models/search-parameters.model';
import {
    FiltersSettingsModel,
    GenericFilterModel,
    FilterPayload,
    BooleanFilterPayload,
    OptionsFilterPayload,
    OptionsRequestPayload,
    RoutesDictFilterPayload,
    FiltersBlockModel,

    FilterOptionsBySearchTermPayload
} from '../../filters/models';

export const SET_CATEGORY_URL = '[FiltersState] set category url';
export const LOAD_ERROR = '[FiltersState] Error during load'

//dropdown actions
export const SET_GENERIC_DROPDOWNS_ARRAY = '[FiltersState] Set dropdowns array';
export const LOAD_FILTER_OPTIONS = '[FiltersState] Load dropdown options';
export const SET_GENERIC_FILTER_OPTIONS = '[FiltersState] Set dropdown options';
export const UNCHECK_GENERIC_FILTER_OPTION = '[FiltersState] Uncheck option';
export const SET_GENERIC_DROPDOWN_STATE = '[FiltersState] Set dropdown active/inactive';
export const SET_GENERIC_FILTER_LOAD_STATE = '[FiltersState] Set dropdown loading true/false';
export const SELECT_DROPDOWN_OPTION = '[FiltersState] On select dropdow option';
export const SET_SELECTED_DROPDOWN_OPTION = '[FiltersState] Set selected dropdown option';
//combobox actions
export const LOAD_COMBOBOX_OPTIONS = '[FiltersState] Load combobox options';
export const SET_COMBOBOXES_ARRAY = '[FiltersState] Set comboboxes array';
export const SETUP_ROUTES_FOR_COMBOBOX = '[CarFilterArray] Set routes for each option';
export const SET_ROUTES_DICT_FOR_COMBOBOX = '[CarFilterArray] Set routes dictionary';
export const CLEAR_COMBOBOX = '[FiltersState] Remove all comboboxes selected options';
export const SELECT_COMBOBOX_OPTION = '[FiltersState] On select combobox option';
export const SET_SELECTED_COMBOBOX_OPTION = '[FiltersState] Set selected combobox option';
export const REMOVE_PROMOTED_ON_COMBOBOXES = '[FiltersState] Set promoted to false on all comboboxes';
//initial setup for filters
export const LOAD_FILTERS_SETTINGS = '[FiltersState] Load filters settings';
export const SET_FILTERS_SETTINGS = '[FiltersState] Set filters settings';
export const SET_FILTERS_SETTINGS_SUCCESS = '[FiltersState] Filters settings set successfully';
export const SET_PROMOTED_FILTERS_INFO = '[FiltersState] Update list of promoted filters';
export const SET_FILTERS_DICT = '[FiltersState] Set filters dict';
export const SET_FILTER_OPTIONS = '[FiltersState] Set generic filter options';
export const REMOVE_FILTER_OPTION = '[FiltersState] Clear generic filter selected options';
export const SYNC_WITH_SEARCH_PARAMS = '[FiltersState] Synchronize filters state with search parameters';
export const SETUP_ROUTING_PARAMS = '[FiltersState] setup routing parameters';
export const SET_CATEGORY_TITLE = '[FiltersState] set category title';
export const FILTER_OPTIONS_BY_SEARCH_TERM = '[FiltersState] filter options by search term';

export class LoadErrorAction implements Action {
    readonly type = LOAD_ERROR;

    constructor() { }
}

export class LoadFilterOptionsAction implements Action {
    readonly type = LOAD_FILTER_OPTIONS;

    constructor(public payload: OptionsRequestPayload) { }
}

export class SetPromotedFiltersInfoAction implements Action {
    readonly type = SET_PROMOTED_FILTERS_INFO;

    constructor(public payload: FiltersBlockModel[]) { }
}

export class SetGenericDropdownsArrayAction implements Action {
    readonly type = SET_GENERIC_DROPDOWNS_ARRAY;

    constructor(public payload: GenericFilterModel[]) { }
}

export class SetGenericFilterOptionsAction implements Action {
    readonly type = SET_GENERIC_FILTER_OPTIONS;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SetGenericDropdownStateAction implements Action {
    readonly type = SET_GENERIC_DROPDOWN_STATE;

    constructor(public payload: BooleanFilterPayload) { }
}

export class SetGenericDropdownLoadStateAction implements Action {
    readonly type = SET_GENERIC_FILTER_LOAD_STATE;

    constructor(public payload: BooleanFilterPayload) { }
}

export class RemoveFilterOptionAction implements Action {
    readonly type = REMOVE_FILTER_OPTION;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SetComboboxesArrayAction implements Action {
    readonly type = SET_COMBOBOXES_ARRAY;

    constructor(public payload: GenericFilterModel[]) { }
}

export class ClearComboboxSelectedOptionsAction implements Action {
    readonly type = CLEAR_COMBOBOX;

    constructor(public payload: FilterPayload) { }
}

export class LoadFilterSettingsAction implements Action {
    readonly type = LOAD_FILTERS_SETTINGS;

    constructor(public payload: SearchParameters) { }
}

export class SetFiltersSettingsAction implements Action {
    readonly type = SET_FILTERS_SETTINGS;

    constructor(public payload: FiltersSettingsModel) { }
}

export class SetFiltersDictAction implements Action {
    readonly type = SET_FILTERS_DICT;

    constructor() { }
}

export class SetFilterOptionsAction implements Action {
    readonly type = SET_FILTER_OPTIONS;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SyncWithSearchParametersAction implements Action {
    readonly type = SYNC_WITH_SEARCH_PARAMS;

    constructor(public payload: SearchParameters) { }
}

export class SetCategoryUrlAction implements Action {
    readonly type = SET_CATEGORY_URL;

    constructor(public payload: string) { }
}

export class SetupRoutingParametersAction implements Action {
    readonly type = SETUP_ROUTING_PARAMS;

    constructor() { }
}

export class SetupRoutesForComboxAction implements Action {
    readonly type = SETUP_ROUTES_FOR_COMBOBOX;

    constructor(public payload: string) { }
}

export class LoadComboboxOptionsAction implements Action {
    readonly type = LOAD_COMBOBOX_OPTIONS;

    constructor(public payload: OptionsRequestPayload) { }
}

export class SetRoutesDictForComboboxAction implements Action {
    readonly type = SET_ROUTES_DICT_FOR_COMBOBOX;

    constructor(public payload: RoutesDictFilterPayload) { }
}

export class SetCategoryTitleAction implements Action {
    readonly type = SET_CATEGORY_TITLE;

    constructor() { }
}

export class SelectDropdownOptionAction implements Action {
    readonly type = SELECT_DROPDOWN_OPTION;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SetSelectedDropdownOptionAction implements Action {
    readonly type = SET_SELECTED_DROPDOWN_OPTION;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SelectComboboxOptionAction implements Action {
    readonly type = SELECT_COMBOBOX_OPTION;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SetSelectedComboboxOptionAction implements Action {
    readonly type = SET_SELECTED_COMBOBOX_OPTION;

    constructor(public payload: OptionsFilterPayload) { }
}

export class UncheckGenericFilterOptionAction implements Action {
    readonly type = UNCHECK_GENERIC_FILTER_OPTION;

    constructor(public payload: OptionsFilterPayload) { }
}

export class SetFiltersSettingsSuccessAction implements Action {
    readonly type = SET_FILTERS_SETTINGS_SUCCESS;

    constructor(public payload: SearchParameters) { }
}

export class RemovePromotedOnComboboxesAction implements Action {
    readonly type = REMOVE_PROMOTED_ON_COMBOBOXES;

    constructor() { }
}

export class FilterOptionsBySearchTermAction implements Action {
    readonly type = FILTER_OPTIONS_BY_SEARCH_TERM;

    constructor(public payload: FilterOptionsBySearchTermPayload) { }
}

export type Actions =
    LoadErrorAction
    | SetGenericDropdownsArrayAction
    | SetGenericFilterOptionsAction
    | SetGenericDropdownStateAction
    | SetGenericDropdownLoadStateAction
    | SetComboboxesArrayAction
    | RemoveFilterOptionAction
    | ClearComboboxSelectedOptionsAction
    | SetPromotedFiltersInfoAction
    | LoadFilterOptionsAction
    | LoadFilterSettingsAction
    | SetFiltersSettingsAction
    | SetFiltersDictAction
    | SetFilterOptionsAction
    | SyncWithSearchParametersAction
    | SetCategoryUrlAction
    | SetupRoutingParametersAction
    | SetupRoutesForComboxAction
    | LoadComboboxOptionsAction
    | SetRoutesDictForComboboxAction
    | SetCategoryTitleAction
    | SelectDropdownOptionAction
    | SetSelectedDropdownOptionAction
    | SelectComboboxOptionAction
    | SetSelectedComboboxOptionAction
    | UncheckGenericFilterOptionAction
    | SetFiltersSettingsSuccessAction
    | RemovePromotedOnComboboxesAction
    | FilterOptionsBySearchTermAction
    ;