
import { CarExtended } from '../../cars-catalog/models';
import { CarFilterRequestParameters } from '../models/car-filter-request-parameters.model';
import { DropdownFilterModel } from '../../filters/models/dropdown-filter.model';
import { StrKeyValueModel } from '../../models';
import * as carSelectPanel from '../actions/car-select-panel.actions';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';

export interface State {
    requestParameters: CarFilterRequestParameters,
    modifsBackup: CarExtended[],
    suitableVehicles: DropdownFilterModel[],
    filterReferencesDict: Object
}

const markTypeKey: string = CarFilterKeys.markKey;
const serieTypeKey: string = CarFilterKeys.serieKey;
const yearTypeKey: string = CarFilterKeys.yearKey;
const modelTypeKey: string = CarFilterKeys.modelKey;
const modifTypeKey: string = CarFilterKeys.modifKey;

const initialState: State = {
    modifsBackup: [],
    requestParameters: { markKey: "", serieKey: "", modelKey: "", year: "", modifKey: "" },
    suitableVehicles: [],
    filterReferencesDict: {}
};

export function reducer(state = initialState, action: carSelectPanel.Actions): State {

    switch (action.type) {

        case carSelectPanel.INIT_BY_MARK: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    markKey: action.payload
                }
            }
        }

        case carSelectPanel.INIT_BY_SERIE: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    serieKey: action.payload
                }
            }
        }

        case carSelectPanel.INIT_BY_MODEL: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    modelKey: action.payload
                }
            }
        }

        case carSelectPanel.INIT_BY_MODIF: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    modifKey: action.payload
                }
            }
        }

        case carSelectPanel.SET_MARK_REQUEST_PARAMS: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    markKey: action.payload
                }
            }
        }

        case carSelectPanel.SET_SERIE_REQUEST_PARAMS: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    serieKey: action.payload
                }
            }
        }

        case carSelectPanel.SET_YEAR_REQUEST_PARAMS: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    year: action.payload
                }
            }
        }

        case carSelectPanel.SET_MODEL_REQUEST_PARAMS: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    modelKey: action.payload
                }
            }
        }

        case carSelectPanel.SET_MODIF_REQUEST_PARAMS: {
            return {
                ...state,
                requestParameters: {
                    ...state.requestParameters,
                    modifKey: action.payload
                }
            }
        }

        case carSelectPanel.SET_MARKS_OPTIONS: {
            let carMarks = action.payload;
            const carMarksOptions: StrKeyValueModel[] = carMarks.filter(x => (x.seriesList && x.seriesList.length)).map(mark =>
                new StrKeyValueModel(mark.markKey, mark.markName));

            const carMarksOptionsFull: StrKeyValueModel[] = carMarks.map(mark =>
                new StrKeyValueModel(mark.markKey, mark.markName));

            let mark = state.filterReferencesDict[markTypeKey] as DropdownFilterModel;
            mark.options = carMarksOptions;
            mark.optionsFullList = carMarksOptionsFull;

            return { ...state };
        }

        case carSelectPanel.SET_SERIES_OPTIONS: {
            let seriesOptions: StrKeyValueModel[] = action.payload.map(serie =>
                new StrKeyValueModel(serie.serieKey, serie.serieName));

            let serie = state.filterReferencesDict[serieTypeKey] as DropdownFilterModel;
            serie.options = seriesOptions;
            serie.optionsFullList = seriesOptions;

            return { ...state };
        }

        case carSelectPanel.SET_YEARS_OPTIONS: {
            let yearOptions: StrKeyValueModel[] = [];
            let defaultYear: number = new Date().getFullYear();
            let startProd: number = defaultYear;
            let endProd: number = 0;
            let models = action.payload;

            if (models.length) {
                models.forEach(car => {
                    if (car.productionStart && car.productionStart < startProd) {
                        startProd = car.productionStart
                    }
                    if (car.productionEnd && car.productionEnd > endProd) {
                        endProd = car.productionEnd;
                    }
                });
            }

            for (let y = startProd; y <= endProd; y++) {
                yearOptions.push({ key: y.toString(), value: y.toString() })
            }

            let year = state.filterReferencesDict[yearTypeKey] as DropdownFilterModel;
            year.options = yearOptions;
            year.optionsFullList = yearOptions;

            return { ...state };
        }

        case carSelectPanel.SET_MODELS_OPTIONS: {
            let modelsOptions: StrKeyValueModel[] = action.payload.map(car =>
                new StrKeyValueModel(car.modelKey, car.modelName));

            let model = state.filterReferencesDict[modelTypeKey] as DropdownFilterModel;
            model.options = modelsOptions;
            model.optionsFullList = modelsOptions;

            return { ...state };
        }

        case carSelectPanel.SET_MODIFS_OPTIONS: {
            let modifsOptions: StrKeyValueModel[] = action.payload.map(car =>
                new StrKeyValueModel(car.typeKey, car.typeName));

            let modif = state.filterReferencesDict[modifTypeKey] as DropdownFilterModel;

            if (modif.options && modif.options.length > 0) {
                let modifKeys = modif.options.map(x => x.key);
                const filter = state.suitableVehicles.find(x => x.filterType == modifTypeKey);
                modifsOptions = filter.options.filter(x => modifKeys.includes(x.key))
            }

            modif.options = modifsOptions;
            modif.optionsFullList = modifsOptions;

            return {
                ...state,
                modifsBackup: action.payload
            };
        }

        case carSelectPanel.SET_SELECTED_MARK: {
            let mark = state.filterReferencesDict[markTypeKey] as DropdownFilterModel;
            mark.selectedOptions = [action.payload];

            return { ...state };
        }

        case carSelectPanel.SET_SELECTED_SERIE: {
            if (action.payload.key == null) {
                action.payload.value = "Все";
            }
            let serie = state.filterReferencesDict[serieTypeKey] as DropdownFilterModel;
            serie.selectedOptions = [action.payload];

            return { ...state };
        }

        case carSelectPanel.SET_SELECTED_YEAR: {
            let year = Number(action.payload.key);
            let modifsOfSelectedYear: StrKeyValueModel[] = [];

            let modifs = state.modifsBackup;
            state.modifsBackup.forEach(model => {
                if ((model.productionStart == 0 || model.productionStart <= year) &&
                    (model.productionEnd == 0 || year <= model.productionEnd)) {
                    modifsOfSelectedYear.push({ key: model.typeKey, value: model.typeName })
                }
            })

            let years = state.filterReferencesDict[yearTypeKey] as DropdownFilterModel;
            years.selectedOptions = [action.payload];

            let filteredModifs = state.filterReferencesDict[modifTypeKey] as DropdownFilterModel;
            filteredModifs.options = modifsOfSelectedYear;
            filteredModifs.optionsFullList = modifsOfSelectedYear;

            return { ...state };
        }

        case carSelectPanel.SET_SELECTED_MODEL: {
            let models = state.filterReferencesDict[modelTypeKey] as DropdownFilterModel;
            models.selectedOptions = [action.payload];

            return { ...state };
        }

        case carSelectPanel.SET_SELECTED_MODIF: {
            let modifs = state.filterReferencesDict[modifTypeKey] as DropdownFilterModel;
            modifs.selectedOptions = [action.payload];

            return { ...state };
        }

        case carSelectPanel.CLEAR_MARK: {
            let marks = state.filterReferencesDict[markTypeKey] as DropdownFilterModel;
            marks.selectedOptions = [];

            return { ...state };
        }

        case carSelectPanel.CLEAR_SERIE: {
            let series = state.filterReferencesDict[serieTypeKey] as DropdownFilterModel;
            series.selectedOptions = [];

            return { ...state };
        }

        case carSelectPanel.CLEAR_YEAR: {
            let years = state.filterReferencesDict[yearTypeKey] as DropdownFilterModel;
            years.selectedOptions = [];

            return { ...state };
        }

        case carSelectPanel.CLEAR_MODEL: {

            //TO DO: fix bug
            //year clear should be handled by clearYear$ effect, but it doesn't work for unknown reason
            let years = state.filterReferencesDict[yearTypeKey] as DropdownFilterModel;//
            years.selectedOptions = [];//

            let models = state.filterReferencesDict[modelTypeKey] as DropdownFilterModel;
            models.selectedOptions = [];

            return { ...state };
        }

        case carSelectPanel.CLEAR_MODIF: {
            let modifs = state.filterReferencesDict[modifTypeKey] as DropdownFilterModel;
            modifs.selectedOptions = [];

            return { ...state };
        }

        case carSelectPanel.SET_SERIE_INPUT_STATE: {
            let series = state.filterReferencesDict[serieTypeKey] as DropdownFilterModel;
            series.isActive = action.payload;

            return { ...state };
        }

        case carSelectPanel.SET_YEAR_INPUT_STATE: {
            let years = state.filterReferencesDict[yearTypeKey] as DropdownFilterModel;
            years.isActive = action.payload;

            return { ...state };
        }

        case carSelectPanel.SET_MODEL_INPUT_STATE: {
            let models = state.filterReferencesDict[modelTypeKey] as DropdownFilterModel;
            models.isActive = action.payload;

            return { ...state };
        }

        case carSelectPanel.SET_MODIF_INPUT_STATE: {
            let modifs = state.filterReferencesDict[modifTypeKey] as DropdownFilterModel;
            modifs.isActive = action.payload;

            return { ...state };
        }

        case carSelectPanel.SET_GENERIC_FILTER_LOAD_STATE: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType];
            if (!targetFilter) {
                return state;
            }
            targetFilter.loading = action.payload.boolValue;
            return { ...state };
        }
        case carSelectPanel.SET_GENERIC_DROPDOWN_STATE: {
            let targetFilter = state.filterReferencesDict[action.payload.filterType];
            if (!targetFilter) {
                return state;
            }
            targetFilter.isActive = action.payload.boolValue;
            return { ...state };
        }

        case carSelectPanel.SETUP_PANEL_STATE: {
            let dict = {};
            action.payload.forEach(f => dict[f.filterType] = f);
            if (dict[markTypeKey]) {
                (dict[markTypeKey] as DropdownFilterModel).isActive = true;
            }

            return {
                ...state,
                suitableVehicles: action.payload,
                filterReferencesDict: dict
            }
        }

        case carSelectPanel.FILTER_OPTIONS_BY_SEARCH_TERM: {
            const payload = action.payload;

            const filter = state.suitableVehicles.find(x => x.filterType == payload.filterType);

            if (!payload.searchTerm) {
                filter.options = filter.optionsFullList;
            } else {
                filter.options = filter.optionsFullList.filter(x =>
                    x.value.toLowerCase().includes(payload.searchTerm.toLowerCase()));
            }

            return {
                ...state,
                suitableVehicles: [...state.suitableVehicles]
            }
        }

        default: {
            return state;
        }
    }
}

export const getRequestParams = (state: State) => state.requestParameters;
export const getCarFiltersArray = (state: State) => state.suitableVehicles;
export const getFiltersDict = (state: State) => state.filterReferencesDict;

export const getMostSpecificVehicleFilter = (state: State) => {
    for (let i = state.suitableVehicles.length - 1; i > -1; i--) {
        if (state.suitableVehicles[i].filterType == yearTypeKey) {
            continue; //no logic for load by year implemented
        }
        if (state.suitableVehicles[i].selectedOptions && state.suitableVehicles[i].selectedOptions.length) {
            return state.suitableVehicles[i];
        }
    }
    return null;
}

export const getVehicleFiltersState = (state: State) => {
    if (!state.suitableVehicles) {
        return [];
    }
    return state.suitableVehicles.map(filter => {
        return {
            filterType: filter.filterType,
            selectedOptions: filter.selectedOptions
        };
    });
}