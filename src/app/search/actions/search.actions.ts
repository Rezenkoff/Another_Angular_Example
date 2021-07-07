import { Action } from '@ngrx/store';
import { KeyValueModel } from '../../models/key-value.model';
import { GenericFilterModel } from '../../filters/models/generic-filter.model';
import { GenericFilterSearchParamModel } from '../../filters/models/generic-filter-search-param.model';
import { SearchParameters } from '../models/search-parameters.model';
import { SearchResult } from '../models/search-result.model';
import { Rest } from '../models/rest.model';
import { Discount } from '../models/discount.model';
import { SortOptionsModel } from '../models/sort-options.model';
import { BalanceDetail } from '../models/balance-detail.model';

export const SEARCH = '[SearchState] Search';
export const CANCEL_SEARCH = '[SearchState] Cancel search';
export const SET_SUCCESS_RESULT = '[SearchState] Set result';
export const SET_ERROR_RESULT = '[SearchState] Set error result';
export const APPLY_FILTERS = '[SearchState] Apply filters';
export const SET_SEARCH_PHRASE = '[SearchState] Set search phrase';
export const SET_FORM_FACTOR = '[SearchState] Set form factor';
export const SET_REST = '[SearchState] Set rest';

export const RESET_CAR_TYPES = '[SearchState] Reset car types';
export const RESET_MANUFACTURER = '[SearchState] Reset manufacturer';
export const RESET_CAR_MODELS = '[SearchState] Reset car models'

export const SEARCH_CAR_TYPES = '[FilterState] Search car types';
export const SET_SUCCESS_CAR_TYPES_RESULT = '[FilterState] Set cart car types result';
export const RESET_CAR_TYPES_FILTER = '[FilterState] Reset cart car types filter';
export const SET_CAR_TYPES_ID = '[SearchState] Set car type`s id';
export const REMOVE_CAR_TYPES_ID = '[SearchState] Remove car type`s id';

export const SEARCH_CAR_MODELS = '[FilterState] Search car models';
export const SET_SUCCESS_CAR_MODELS_RESULT = '[FilterState] Set car models result';
export const RESET_CAR_MODELS_FILTER = '[FilterState] Reset car models filter';
export const SET_CAR_MODEL_ID = '[SearchState] Set manufacturer`s id';
export const REMOVE_CAR_MODEL_ID = '[SearchState] Remove manufacturer`s id';

export const SEARCH_PRODUCT_LINES = '[FilterState] Search product lines';
export const SET_SUCCESS_PRODUCT_LINES_RESULT = '[FilterState] Set productLines result';
export const RESET_PRODUCT_LINES = '[FilterState] Reset product lines filter';
export const PACKING_RATE_EXTEND = '[FilterState] Extend packing rate';
export const SUCCESS = '[FilterState] Success action';

export const SET_SORT_FIELDS = '[SearchState] Set sort field';
export const SET_FROM_FIELD = '[SearchState] Set from field';
export const SET_PAGE_SIZE = '[SearchState] Set page size';

export const SET_MODEL_ID = '[SearchState] Set model id';
export const REMOVE_MODEL_ID = '[SearchState] Remove model id';

export const RESET_FILTER_OPTIONS = '[SearchState] Reset filters';
export const RESET_FILTER_OPTIONS_TIRES_CAR = '[SearchState] Reset filters without car for tires';

export const SET_SUCCESS_PRICES = '[SearchState] Get prices';
export const SET_SUCCESS_REST = '[SearchState] Get rests';
export const SET_SUCCESS_DISCOUNTS = '[SearchState] Get discounts';

export const SET_CATALOG_ID = '[SearchState] Set catalog id';
export const REFRESH_CATALOG_FILTER = '[SearchState] RefreshCatalog';

export const SET_NEAREST_STORE = '[SearchState] Set nearest store area name';
export const UPDATE_REST_STATUSES = '[SearchState] Update rest statuses for products in store';

export const SET_SEARCH_PARAMETERS = '[SearchState] Set search parameters';

export const SET_LANGUAGE = '[SearchState] Set selected language';
export const PERFORM_TRANSLATION = '[SearchState] Translate products descriptions';

export const SET_CATEGORY_URL = '[SearchState] Set catalog URL';
export const UPSERT_GENERIC_FILTER_VALUE = '[SearchState] Upsert generic filter value';
export const SET_GENERIC_FILTER_VALUE = '[SearchState] Set generic filter value';
export const REMOVE_GENERIC_FILTER_VALUE = '[SearchState] Remove generic filter value';
export const CLEAR_GENERIC_FILTERS = '[SearchState] Clear generic filters';
export const SET_PROMOTED_FILTERS_INFO = '[SearchState] Set Promoted Filters Info';
export const DELETE_GENERIC_FILTERS_BY_TYPES = '[SearchState] Delete generic filters from search parameters';

export const LOAD_MORE_PRODUCTS = '[SearchState] Load more products';
export const APPEND_PRODUCTS = '[SearchState] Append products';
export const STORE_CURRENT_PRODUCTS = '[SearchState] Store current products';

export const SET_IS_FAVORITE = '[SearchState] Set IsFavorite flag for products';

export const SET_KEYWORD = '[SearchState] Set keyword value';

export class SuccessAction implements Action {
    readonly type = SUCCESS;

    constructor() { }
}

export class PackingRateExtendAction implements Action {
    readonly type = PACKING_RATE_EXTEND;

    constructor(public payload: string[]) { }
}

export class SetSearchPhraseAction implements Action {
    readonly type = SET_SEARCH_PHRASE;

    constructor(public payload: string) {        
        new ResetCarModelsFilter();
    }
}

export class SearchAction implements Action {
    readonly type = SEARCH;

    constructor() { }
}

export class CancelSearchAction implements Action {
    readonly type = CANCEL_SEARCH;

    constructor() { }
}

export class SetSuccessResultAction implements Action {
    readonly type = SET_SUCCESS_RESULT;

    constructor(public payload: SearchResult) { }
}

export class SetErrorResultAction implements Action {
    readonly type = SET_ERROR_RESULT;

    constructor() { }
}

export class SetFormFactor implements Action {
    readonly type = SET_FORM_FACTOR;
    constructor(public payload: number) { }
}

export class SetRest implements Action {
    readonly type = SET_REST;
    constructor(public payload: number) { }
}

export class SearchCarTypesAction implements Action {
    readonly type = SEARCH_CAR_TYPES;

    constructor(public payload: string) { }
}

export class SetSuccessCarTypesResultAction implements Action {
    readonly type = SET_SUCCESS_CAR_TYPES_RESULT;

    constructor(public payload: KeyValueModel[]) { }
}

export class ResetCarTypesFilter implements Action {
    readonly type = RESET_CAR_TYPES_FILTER;

    constructor() { }
}

export class SearchCarModelsAction implements Action {
    readonly type = SEARCH_CAR_MODELS;

    constructor(public payload: string) { }
}

export class SetSuccessCarModelsResultAction implements Action {
    readonly type = SET_SUCCESS_CAR_MODELS_RESULT;

    constructor(public payload: KeyValueModel[]) { }
}

export class ResetCarModelsFilter implements Action {
    readonly type = RESET_CAR_MODELS_FILTER;

    constructor() { }
}

export class SetCarTypeIdAction implements Action {
    readonly type = SET_CAR_TYPES_ID;

    constructor(public payload: number) { }
}

export class RemoveCarTypeIdAction implements Action {
    readonly type = REMOVE_CAR_TYPES_ID;

    constructor(public payload: number) { }
}

export class SetCarModelIdAction implements Action {
    readonly type = SET_MODEL_ID;

    constructor(public payload: number) { }
}

export class RemoveCarModelIdAction implements Action {
    readonly type = REMOVE_MODEL_ID;

    constructor(public payload: number) { }
}

export class ResetCarTypes implements Action {
    readonly type = RESET_CAR_TYPES;

    constructor() { }
}

export class ResetCarModels implements Action {
    readonly type = RESET_CAR_MODELS;

    constructor() { }
}

export class SetSortFields implements Action {
    readonly type = SET_SORT_FIELDS;

    constructor(public payload: SortOptionsModel) { }
}

export class SetFromField implements Action {
    readonly type = SET_FROM_FIELD;

    constructor(public payload: number) { }
}

export class SetPageSize implements Action {
    readonly type = SET_PAGE_SIZE;

    constructor(public payload: number) { }
}

export class SetSuccessPrices implements Action {
    readonly type = SET_SUCCESS_PRICES;

    constructor(public payload: BalanceDetail) { }
}

export class SetSuccessRests implements Action {
    readonly type = SET_SUCCESS_REST;

    constructor(public payload: Rest[]) { }
}

export class SetSuccessDiscounts implements Action {
    readonly type = SET_SUCCESS_DISCOUNTS;

    constructor(public payload: Discount[]) { }
}

export class SetCatalogId implements Action {
    readonly type = SET_CATALOG_ID;

    constructor(public payload: number) { }
}

export class RefreshCatalogFilter implements Action {
    readonly type = REFRESH_CATALOG_FILTER;

    constructor() { }
}

export class SetSearchParameters implements Action {
    readonly type = SET_SEARCH_PARAMETERS;

    constructor(public payload: SearchParameters) { }
}

export class ResetFilterOption implements Action {
    readonly type = RESET_FILTER_OPTIONS;

    constructor() { }
}

export class ResetFilterOptionTiresCar implements Action {
    readonly type = RESET_FILTER_OPTIONS_TIRES_CAR;

    constructor() { }
}

export class SetNearestStoreAction implements Action {
    readonly type = SET_NEAREST_STORE;

    constructor(public payload: string) { }
}

export class UpdateRestStatuses implements Action {
    readonly type = UPDATE_REST_STATUSES;

    constructor() { }
}

export class SetSelectedLanguage implements Action {
    readonly type = SET_LANGUAGE;

    constructor(public payload: string) { }
}

export class PerformDescriptionsTranslation implements Action {
    readonly type = PERFORM_TRANSLATION;

    constructor() { }
}

export class SetCategoryUrl implements Action {
    readonly type = SET_CATEGORY_URL;

    constructor(public payload: string) { }
}

export class SetGenericFilterValue implements Action {
    readonly type = SET_GENERIC_FILTER_VALUE;

    constructor(public payload: GenericFilterSearchParamModel) { }
}

export class UpsertGenericFilterValue implements Action {
    readonly type = UPSERT_GENERIC_FILTER_VALUE;

    constructor(public payload: GenericFilterSearchParamModel) { }
}

export class RemoveGenericFilterValue implements Action {
    readonly type = REMOVE_GENERIC_FILTER_VALUE;

    constructor(public payload: GenericFilterSearchParamModel) { }
}

export class ClearGenericFilters implements Action {
    readonly type = CLEAR_GENERIC_FILTERS;

    constructor() { }
}

export class SetPromotedFiltersInfo implements Action {
    readonly type = SET_PROMOTED_FILTERS_INFO;

    constructor(public payload: Array<GenericFilterModel>) { }
}

export class LoadMoreProducts implements Action {
    readonly type = LOAD_MORE_PRODUCTS;

    constructor() { }
}

export class AppendProducts implements Action {
    readonly type = APPEND_PRODUCTS;

    constructor() { }
}

export class StoreCurrentProducts implements Action {
    readonly type = STORE_CURRENT_PRODUCTS;

    constructor() { }
}

export class SetIsFavorite implements Action {
    readonly type = SET_IS_FAVORITE;

    constructor(public payload: number[]) { }
}

export class DeleteGenericFiltersByTypes implements Action {
    readonly type = DELETE_GENERIC_FILTERS_BY_TYPES;

    constructor(public payload: string[]) {}
}

export class SetKeyword implements Action {
    readonly type = SET_KEYWORD;

    constructor(public payload: string) {}
}

export type Actions =
    SearchAction
    | CancelSearchAction
    | SetSuccessResultAction
    | SetErrorResultAction
    | SetSearchPhraseAction
    | SetFormFactor
    | SetRest
    | SearchCarTypesAction
    | SetSuccessCarTypesResultAction
    | ResetCarTypesFilter
    | SearchCarModelsAction
    | SetSuccessCarModelsResultAction
    | ResetCarModelsFilter
    | SetCarTypeIdAction
    | RemoveCarTypeIdAction
    | SetCarModelIdAction
    | RemoveCarModelIdAction
    | ResetCarTypes
    | ResetCarModels
    | PackingRateExtendAction
    | SetSortFields
    | SetFromField
    | SetPageSize
    | SetSuccessPrices
    | SetSuccessRests
    | SetSuccessDiscounts
    | SetCatalogId
    | RefreshCatalogFilter
    | SetSearchParameters
    | ResetFilterOption
    | ResetFilterOptionTiresCar
    | SetNearestStoreAction
    | UpdateRestStatuses
    | SetSelectedLanguage
    | PerformDescriptionsTranslation
    | SetCategoryUrl
    | SetGenericFilterValue
    | UpsertGenericFilterValue 
    | RemoveGenericFilterValue
    | SetPromotedFiltersInfo
    | ClearGenericFilters
    | LoadMoreProducts
    | AppendProducts
    | StoreCurrentProducts
    | SetIsFavorite
    | ClearGenericFilters
    | DeleteGenericFiltersByTypes
    | SetKeyword;