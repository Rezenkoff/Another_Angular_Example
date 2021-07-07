import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CarExtended, CarMark, CarSerie, } from '../../cars-catalog/models';
import {
    GenericFilterModel,
    ComboboxFilterModel,
    DropdownFilterModel,
    FilterTypesEnum,
    SeoRoute,
    PriorityUrlPair,
    AppliedOptionModel
} from '../../filters/models';
import { StrKeyValueModel } from '../../models';
import { RoutingParametersModel } from '../../models/routing-parameters.model';
import * as filtersActions from '../actions/filters.actions';
import { TransliterationHelper } from '../helpers/transliteration.helper';
import { CatalogType } from '../../catalog/models/catalog-type.enum';

export interface State {
    categoryUrl: string,
    categoryTitle: string,
    searchPhrase: string,
    suitableVehiclesFilterEnabled: boolean,
    modelsBackup: CarExtended[],
    dropdowns: DropdownFilterModel[],
    comboboxes: ComboboxFilterModel[],
    suitableVehicles: DropdownFilterModel[],
    promotedFilters: GenericFilterModel[],
    filterReferencesDict: Object,
    routeParameters: SeoRoute,
    comboboxLinksEnabled: boolean,
    appliedOptions: AppliedOptionModel[], //filters which actualy applied
    catalogType: number, //formFactor
}

const initialState: State = {
    categoryUrl: "",
    categoryTitle: "",
    searchPhrase: "",
    suitableVehiclesFilterEnabled: false,
    modelsBackup: [],
    dropdowns: [],
    comboboxes: [],
    suitableVehicles: [],
    promotedFilters: [],
    filterReferencesDict: {},
    routeParameters: null,
    comboboxLinksEnabled: true,
    appliedOptions: [],
    catalogType: 2
};

export function reducer(state = initialState, action: filtersActions.Actions): State {

    switch (action.type) {

        case filtersActions.LOAD_FILTERS_SETTINGS: {
            return {
                ...state
            }
        }

        case filtersActions.SET_CATEGORY_URL: {
            return {
                ...state,
                categoryUrl: action.payload
            }
        }

        case filtersActions.SET_GENERIC_FILTER_OPTIONS: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType];
            if (!targetFilter) {
                return state;
            }
            targetFilter.options = action.payload.options;
            targetFilter.optionsFullList = action.payload.options;

            return { ...state };
        }

        case filtersActions.SET_SELECTED_DROPDOWN_OPTION: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType];
            if (!targetFilter) {
                return state;
            }
            targetFilter.selectedOptions = action.payload.options;
            return { ...state };
        }

        case filtersActions.SET_SELECTED_COMBOBOX_OPTION: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType] as ComboboxFilterModel;
            if (!targetFilter) {
                return state;
            }
            if (!targetFilter.selectedOptions || !targetFilter.selectedOptions.length) {
                targetFilter.selectedOptions = action.payload.options;
                return { ...state };
            }
            let idx = targetFilter.selectedOptions.findIndex(x => x.key == action.payload.options[0].key);
            if (idx >= 0) {
                targetFilter.selectedOptions.splice(idx, 1);
                return { ...state };
            } else {
                targetFilter.selectedOptions = [
                    ...targetFilter.selectedOptions,
                    ...action.payload.options
                ];
                return { ...state };
            }
        }

        case filtersActions.UNCHECK_GENERIC_FILTER_OPTION: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType] as GenericFilterModel;
            if (!targetFilter) {
                return state;
            }
            let idx = targetFilter.selectedOptions.findIndex(x => x.key == action.payload.options[0].key);
            if (idx >= 0) {
                targetFilter.selectedOptions.splice(idx, 1);
                return { ...state };
            }
            return state;
        }

        case filtersActions.SET_GENERIC_FILTER_LOAD_STATE: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType] as GenericFilterModel;
            if (!targetFilter) {
                return state;
            }
            targetFilter.loading = action.payload.boolValue;
            if (!action.payload.boolValue) {
                targetFilter.hasLoaded = true;
            }
            return { ...state };
        }

        case filtersActions.SET_GENERIC_DROPDOWN_STATE: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType];
            if (!targetFilter) {
                return state;
            }
            targetFilter.isActive = action.payload.boolValue;
            return { ...state };
        }

        case filtersActions.REMOVE_FILTER_OPTION: {
            let target = state.filterReferencesDict[action.payload.filterType] as GenericFilterModel;
            if (!target) {
                return state;
            }

            target.selectedOptions = target.selectedOptions
                .filter(o => !action.payload.options.includes(o));

            return { ...state };
        }

        case filtersActions.CLEAR_COMBOBOX: {
            let targetCombobox = state.comboboxes.find(d => d.filterType == action.payload.filterType);
            if (!targetCombobox) {
                return state;
            }
            targetCombobox.selectedOptions = [];
            return { ...state };
        }

        case filtersActions.SET_PROMOTED_FILTERS_INFO: {
            let promoted: GenericFilterModel[] = []
            action.payload.forEach(block => {
                let vehicleFiltersArray = block.carSelectPanelArray.filter(f => f.isPromoted == true);
                let comboboxFiltersArray = block.comboboxesArray.filter(f => f.isPromoted == true);
                let dropdownsFiltersArray = block.dropdownsArray.filter(f => f.isPromoted == true);
                promoted = [...promoted, ...vehicleFiltersArray, ...comboboxFiltersArray, ...dropdownsFiltersArray];
                promoted = promoted.sort((a, b) => { return a.positionPriority - b.positionPriority });
            })

            return {
                ...state,
                promotedFilters: promoted
            }
        }

        case filtersActions.SET_FILTERS_SETTINGS: {
            let settings = action.payload;

            let suitableVehicleSettings = settings.filterBlocksList.reduce((accumulator, currentValue) =>
                [...accumulator, ...currentValue.carSelectPanelArray as DropdownFilterModel[]], [] as DropdownFilterModel[]);
            suitableVehicleSettings.forEach(f => f.selectedOptions = []);
            suitableVehicleSettings = suitableVehicleSettings.sort((a, b) => { return a.positionPriority - b.positionPriority })

            let markSettings = suitableVehicleSettings
                .find(x => x.filterType == FilterTypesEnum[FilterTypesEnum.SuitableVehicles_Mark]) as DropdownFilterModel;
            if (markSettings) {
                markSettings.isActive = true;
            }

            let dropdowns = settings.filterBlocksList.reduce((accumulator, currentValue) =>
                [...accumulator, ...currentValue.dropdownsArray as DropdownFilterModel[]], [] as DropdownFilterModel[])
                .map(filter => {
                    filter.isActive = true;
                    filter.selectedOptions = [new StrKeyValueModel("", "")];
                    return filter
                });

            let comboboxes = settings.filterBlocksList.reduce((accumulator, currentValue) =>
                [...accumulator, ...currentValue.comboboxesArray as ComboboxFilterModel[]], [] as ComboboxFilterModel[]);
            if (!state.comboboxLinksEnabled) {
                comboboxes.forEach(c => c.isPromoted = false)
            }

            return {
                ...state,
                dropdowns: dropdowns,
                comboboxes: comboboxes,
                suitableVehicles: suitableVehicleSettings,
                suitableVehiclesFilterEnabled: settings.suitableVehiclesFilterEnabled
            }
        }

        case filtersActions.SET_FILTERS_DICT: {
            let dict = {};

            state.suitableVehicles.forEach(f => dict[f.filterType] = f);
            state.comboboxes.forEach(f => dict[f.filterType] = f);
            state.dropdowns.forEach(f => dict[f.filterType] = f);

            return {
                ...state,
                filterReferencesDict: dict
            }
        }

        case filtersActions.SET_FILTER_OPTIONS: {
            let filter = state.filterReferencesDict[action.payload.filterType] as GenericFilterModel;
            if (!filter) {
                return state;
            }
            filter.selectedOptions = action.payload.options;

            return {
                ...state,
                filterReferencesDict: { ...state.filterReferencesDict }
            }
        }

        case filtersActions.SYNC_WITH_SEARCH_PARAMS: {
            let searchParams = action.payload;
            state.appliedOptions = [];

            for (let propName in state.filterReferencesDict) {
                let filter = state.filterReferencesDict[propName] as GenericFilterModel;
                filter.selectedOptions = [];

                if (!searchParams[propName] || !searchParams[propName].length) {
                    continue;
                }

                let selectedKeys = searchParams[propName] as string[];

                selectedKeys.forEach(key => {
                    let option = filter.options.find(o => o.key == key);
                    if (option) {
                        filter.selectedOptions.push(option);
                    } else {
                        let helper = new TransliterationHelper();
                        let value = helper.restoreOriginalText(key);
                        option = new StrKeyValueModel(key, value);
                        filter.options.push(option);
                        filter.selectedOptions.push(option);
                    }
                    let appliedOption: AppliedOptionModel = {
                        option: option,
                        filterType: filter.filterType,
                        filterNameRus: filter.titleRus,
                        filterNameUkr: filter.titleUkr
                    }
                    state.appliedOptions.push(appliedOption);
                });
            }
            return {
                ...state,
                searchPhrase: action.payload.searchPhrase,
                catalogType: action.payload.formFactor
            };
        }

        case filtersActions.SETUP_ROUTING_PARAMS: {
            let seoRoute: SeoRoute = new SeoRoute();
            seoRoute.routeSectionsArray = (state.categoryUrl) ?
                [
                    { priority: -100, url: "/category" },
                    { priority: -99, url: state.categoryUrl }
                ] :
                [
                    { priority: -100, url: "/search-result" }
                ];

            let promotedFilters: GenericFilterModel[] = [];
            let otherFilters: GenericFilterModel[] = [];

            for (let prop in state.filterReferencesDict) {
                let filter = state.filterReferencesDict[prop] as GenericFilterModel;
                if (!filter.selectedOptions || !filter.selectedOptions.length) {
                    continue;
                }
                if (filter.isPromoted && filter.selectedOptions.length == 1) {
                    promotedFilters.push(filter);
                    continue;
                }
                otherFilters.push(filter);
            }
            //promoted
            promotedFilters.forEach(filter => {
                let key = filter.selectedOptions[0].key;
                seoRoute.routeSectionsArray.push({
                    priority: filter.positionPriority,
                    url: `${key}--${FilterTypesEnum[filter.filterType]}`
                });
            })
            //not promoted
            otherFilters.forEach(filter => {
                seoRoute.queryParameters.queryParams[filter.filterType] = filter.selectedOptions.map(o => o.key);
            })
            //search phrase
            if (state.searchPhrase) {
                seoRoute.queryParameters.queryParams["searchPhrase"] = state.searchPhrase;
            }
            if (state.catalogType != CatalogType.Full) {
                seoRoute.queryParameters.queryParams["formFactor"] = state.catalogType;
            }

            seoRoute.routeSectionsArray = seoRoute.routeSectionsArray.sort((a, b) => { return a.priority - b.priority });

            return {
                ...state,
                routeParameters: seoRoute
            }
        }

        case filtersActions.SET_ROUTES_DICT_FOR_COMBOBOX: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType] as ComboboxFilterModel;
            if (!targetFilter) {
                return state;
            }
            targetFilter.routesDict = action.payload.routesDict

            return {
                ...state
            }
        }

        case filtersActions.SET_CATEGORY_TITLE: {
            let text = '';
            let brandForShow: string = '';
            let count: number = 0;
            
            state.promotedFilters.forEach(f => {
                if (f.selectedOptions && f.selectedOptions.length) {                   
                    if (FilterTypesEnum[f.filterType] < FilterTypesEnum.SuitableVehicles_Mark) {
                        state.comboboxes.forEach(el => {  
                            if(el.filterType.indexOf("_Manufacturer") != -1 ){ 
                                let countSelectedOpt : number = 0;  
                                if(!el.options)
                                {
                                    return;
                                }                              
                                el.options.forEach(optVal =>{                                      
                                    el.selectedOptions.forEach(optSel => {
                                        let optValValue:string = optVal.value;
                                        if(optVal.key == optSel.key && brandForShow.indexOf(optValValue) == -1){
                                            brandForShow += optVal.value + " ";
                                            countSelectedOpt++;
                                        }
                                    });
                                });
                            }                                                                                     
                        });
                   
                    if(brandForShow.indexOf(",") == -1){
                        brandForShow = brandForShow.trim().replace(/ /g, ", "); 
                    } 
                    if(text.trim().indexOf(brandForShow) == -1)
                    {
                        text = `${text} ${ brandForShow}`;
                    }                          
                    
                    return;
                }
                    if (FilterTypesEnum[f.filterType] == FilterTypesEnum.SuitableVehicles_Mark && count == 0) {
                        let markCarShow = "";
                        if (state.filterReferencesDict["SuitableVehicles_Mark"].selectedOptions.length > 0) {
                            markCarShow += state.filterReferencesDict["SuitableVehicles_Mark"].selectedOptions[0].value;
                        }
                        if (state.filterReferencesDict["SuitableVehicles_Serie"].selectedOptions.length > 0) {
                            markCarShow += " " + state.filterReferencesDict["SuitableVehicles_Serie"].selectedOptions[0].value
                        }
                        text = `для ${markCarShow}`;
                        return;
                    }
                    count++;
                }
            })

            return {
                ...state,
                categoryTitle: text
            }
        }

        case filtersActions.REMOVE_PROMOTED_ON_COMBOBOXES: {
            state.comboboxes.forEach(c => c.isPromoted = false);

            return {
                ...state,
                comboboxLinksEnabled: false
            }
        }

        case filtersActions.FILTER_OPTIONS_BY_SEARCH_TERM: {
            const payload = action.payload;

            const filter = state.dropdowns.find(x => x.filterType == payload.filterType);

            if (!payload.searchTerm) {
                filter.options = filter.optionsFullList;
            } else {
                filter.options = filter.optionsFullList.filter(x =>
                    x.value.toLowerCase().includes(payload.searchTerm.toLowerCase()));
            }

            return {
                ...state,
                dropdowns: [ ...state.dropdowns ]
            }
        }

        default: {
            return state;
        }
    }
}

export const getSuitableVehiclesEnabledProperty = (state: State) => state.suitableVehiclesFilterEnabled;
export const getCarFiltersArray = (state: State) => state.suitableVehicles;
export const getDropdowns = (state: State) => state.dropdowns;
export const getComboboxes = (state: State) => state.comboboxes;
export const getFiltersDict = (state: State) => state.filterReferencesDict;
export const getRouteParams = (state: State) => state.routeParameters;
export const getTextForCategoryTitle = (state: State) => state.categoryTitle;
export const getAppliedOptions = (state: State) => state.appliedOptions;
export const getCategoryUrl = (state: State) => state.categoryUrl;