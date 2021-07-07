import { SearchParameters, SearchResult } from '../models';
import * as search from '../actions/search.actions';
import { Product, SearchFilterModel, FilterParameters } from '../../models';
import { GenericFilterModel } from '../../filters/models'
import { setTranslatedDescription } from '../../product/product-functions-provider';
import { Area } from '../../location/area/area.model';

export interface State {
    searchParameters: SearchParameters,
    searchResult: SearchResult,
    carTypes: SearchFilterModel,
    carModels: SearchFilterModel,
    productLines: SearchFilterModel,
    nearestStoreAreaName: string,
    selectedLanguageName: string,
    promotedFiltersInfo: Array<GenericFilterModel>,
    previousProducts: Product[],
    productImagesLookup: Object,
    loadInProcess: boolean
}

const initialState: State = {
    searchParameters: new SearchParameters(),
    searchResult: new SearchResult(),
    carTypes: new SearchFilterModel('', []),
    carModels: new SearchFilterModel('', []),
    productLines: new SearchFilterModel('', []),
    nearestStoreAreaName: '',
    selectedLanguageName: '',
    promotedFiltersInfo: [],
    previousProducts: [],
    productImagesLookup: {},
    loadInProcess: false
};

export const ExtendProducts = (products: Product[], ids: any): Product[] => {

    products.forEach(p => {
        let num = ids[p.cardId];
        if (num) {
            p.compulsory = num.compulsory
            p.incDecStep = num.value
        }
    })

    return products;
}

export function reducer(state = initialState, action: search.Actions): State {

    switch (action.type) {

        case search.SEARCH: {
            return {
                ...state,
                loadInProcess: true
            };
        }

        case search.SET_SEARCH_PHRASE: {
            return {
                ...state,
                searchParameters: {
                    searchPhrase: action.payload,
                    carModels: [],
                    carTypes: [],
                    formFactor: 2,
                    rest: 0,
                    productLines: [],
                    sortField: '',
                    sortOrder: 1,
                    treeParts: [],
                    from: 0,
                    count: 20,
                    categoryUrl: '',
                    selectedCategory: '',
                    keyword: '',
                    artId: 0,
                    showAll: true
                }
            };
        }

        case search.PACKING_RATE_EXTEND: {
            let searchResult = state.searchResult;
            searchResult.products = ExtendProducts(state.searchResult.products, action.payload);
            return {
                ...state,
                searchResult: searchResult
            }
        }

        case search.SET_SUCCESS_RESULT: {
            return {
                ...state,
                searchResult: action.payload,
                loadInProcess: false
            };
        }

        case search.SET_ERROR_RESULT: {
            return {
                ...state,
                loadInProcess: false
            }

        }

        case search.SET_MODEL_ID: {
            let newModelArray = state.searchParameters.carModels;
            newModelArray.push(action.payload);
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carModels: newModelArray
                }
            };
        }

        case search.REMOVE_MODEL_ID: {
            let newModelsArray = state.searchParameters.carModels;
            let index = newModelsArray.indexOf(action.payload);
            newModelsArray.splice(index, 1);
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carModels: newModelsArray
                }
            };
        }

        case search.SET_FORM_FACTOR: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    formFactor: action.payload,
                    from: 0
                }
            }
        }

        case search.SET_REST: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    rest: action.payload
                }
            }
        }

        case search.SEARCH_CAR_TYPES: {
            return {
                ...state,
                carTypes: {
                    ...state.carTypes
                },
                searchParameters: {
                    ...state.searchParameters,
                    searchPhrase: action.payload
                }
            };
        }

        case search.SET_SUCCESS_CAR_TYPES_RESULT: {
            return {
                ...state,
                carTypes: {
                    ...state.carTypes,
                    items: action.payload
                }
            };
        }

        case search.RESET_CAR_TYPES_FILTER: {
            return {
                ...state,
                carTypes: new SearchFilterModel('', []),
                searchParameters: {
                    ...state.searchParameters,
                    from: 0
                }
            }
        }

        case search.SEARCH_CAR_MODELS: {
            return {
                ...state,
                carModels: {
                    ...state.carModels,
                    keyword: action.payload
                }
            };
        }

        case search.SET_SUCCESS_CAR_MODELS_RESULT: {
            return {
                ...state,
                carModels: {
                    ...state.carModels,
                    items: action.payload
                }
            };
        }

        case search.RESET_CAR_MODELS_FILTER: {
            return {
                ...state,
                carModels: new SearchFilterModel('', []),
                searchParameters: {
                    ...state.searchParameters,
                    from: 0
                }
            }
        }

        case search.SET_CAR_TYPES_ID: {
            let newCarTypesArray = state.searchParameters.carTypes;
            newCarTypesArray.push(action.payload);
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carTypes: newCarTypesArray,
                    from: 0
                }
            };
        }

        case search.REMOVE_CAR_TYPES_ID: {
            let newCarTypeArray = state.searchParameters.carTypes;
            let index = newCarTypeArray.indexOf(action.payload);
            newCarTypeArray.splice(index, 1);
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carTypes: newCarTypeArray,
                    from: 0
                }
            };
        }

        case search.SET_CAR_TYPES_ID: {
            let newCarTypesArray = state.searchParameters.carTypes;
            newCarTypesArray.push(action.payload);
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carTypes: newCarTypesArray,
                    from: 0
                }
            };
        }

        case search.REMOVE_CAR_TYPES_ID: {
            let newCarTypeArray = state.searchParameters.carTypes;
            let index = newCarTypeArray.indexOf(action.payload);
            newCarTypeArray.splice(index, 1);
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carTypes: newCarTypeArray,
                    from: 0
                }
            };
        }

        case search.RESET_CAR_TYPES: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carTypes: []
                }
            }
        }

        case search.RESET_CAR_MODELS: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    carModels: []
                }
            }
        }

        case search.SET_SORT_FIELDS: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    sortField: action.payload.sortField,
                    sortOrder: action.payload.sortOrder,
                    from: 0
                }
            };
        }

        case search.SET_FROM_FIELD: {
            let newPageField = state.searchParameters.from;
            newPageField = action.payload;
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    from: newPageField
                }
            }
        }

        case search.SET_SUCCESS_PRICES: {
            let products = state.searchResult.products;
            products.forEach(p => {
                let price = action.payload.prices.find(x => x.articleId == p.id);
                let supplierPrice = action.payload.supplierBalanceDetails.find(b => b.articleId == p.id);

                if (price) {
                    p.price = price.customerPrice;
                    p.oldPrice = price.oldPrice;
                    p.hidePrice = price.hidePrice;
                    p.quantityForDiscount = price.quantityForDiscount;
                    p.discountPrice = price.discountPrice;
                }

                if (supplierPrice && supplierPrice.supliersRest && supplierPrice.supliersRest[0]) {
                    p.supplierProductRef_Key = supplierPrice.supliersRest[0].supplierProductRef_Key;
                    p.supplierRef_Key = supplierPrice.supliersRest[0].supplierRef_Key;
                    p.price = supplierPrice.supliersRest[0].customerPrice;
                    p.hidePrice = false;
                }
            });

            if (state.searchParameters.sortField === "Price") {
                products = (state.searchParameters.sortOrder == 1)
                    ? products.sort((a, b) => { return (a.price > b.price) ? -1 : 1 })
                    : products.sort((a, b) => { return (a.price < b.price) ? -1 : 1 })
            }

            return {
                ...state,
                searchResult: {
                    ...state.searchResult,
                    products: products

                }
            }
        }

        case search.SET_PAGE_SIZE: {

            let currentPage = (state.searchParameters.from / state.searchParameters.count);
            let newPageSize = action.payload;
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    count: newPageSize,
                    from: 0
                }
            }
        }

        case search.SET_SUCCESS_REST: {
            let products = state.searchResult.products.map(prod => new Product().deserialize(prod));
            let storeAreaName = state.nearestStoreAreaName;
            products.forEach(p => {
                let rest = action.payload.find(x => x.artId == p.id);
                if (rest) {
                    p.rest = rest;
                }
                p.setRestInfoForProduct(new Area({ nearestStoreAreaKey: state.nearestStoreAreaName }));
            });

            return {
                ...state,
                searchResult: {
                    ...state.searchResult,
                    products: products
                }
            }
        }

        case search.SET_SUCCESS_DISCOUNTS: {
            let products = state.searchResult.products;
            products.forEach(p => {
                let discount = (action.payload) ? action.payload.find(x => x.articleId == p.id) : null;
                if (discount && discount.discountRate)
                    p.oldPrice = Number((p.price / discount.discountRate).toFixed(2));
            });
            return {
                ...state,
                searchResult: {
                    ...state.searchResult,
                    products: products
                }
            }
        }

        case search.SET_CATALOG_ID: {
            let catalogIds = [action.payload];
            let params = state.searchParameters;
            params.treeParts = catalogIds;
            return {
                ...state,
                searchParameters: params
            }
        }

        case search.REFRESH_CATALOG_FILTER: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    treeParts: []
                }
            }
        }

        case search.SET_SEARCH_PARAMETERS: {
            let params = new SearchParameters();
            params = { ...params, ...action.payload };

            state.searchResult = new SearchResult();

            return {
                ...state,
                searchParameters: params
            }
        }

        case search.RESET_FILTER_OPTIONS: {
            let params = new SearchParameters();
            params.searchPhrase = state.searchParameters.searchPhrase;
            params.treeParts = state.searchParameters.treeParts;

            return {
                ...state,
                searchParameters: params
            }
        }

        case search.RESET_FILTER_OPTIONS_TIRES_CAR: {
            let params = new SearchParameters();
            params.searchPhrase = state.searchParameters.searchPhrase;
            params.treeParts = state.searchParameters.treeParts;

            for (var key in state.searchParameters) {
                if (state.searchParameters.categoryUrl == "shiny-id49-3" && (key == "SuitableVehicles_Mark" || key == "SuitableVehicles_Model" || key == "SuitableVehicles_Modif")) {
                    params[key] = state.searchParameters[key];
                }
            }

            return {
                ...state,
                searchParameters: params
            }
        }

        case search.SET_NEAREST_STORE: {
            return {
                ...state,
                nearestStoreAreaName: action.payload
            }
        }

        case search.UPDATE_REST_STATUSES: {
            let storeAreaName = state.nearestStoreAreaName;
            let products = state.searchResult.products.map(prod => new Product().deserialize(prod));

           products.map(p => {
                p.setRestInfoForProduct(new Area({ nearestStoreAreaKey: state.nearestStoreAreaName }));
            });

            return {
                ...state,
                searchResult: {
                    ...state.searchResult,
                    products: products
                }
            }
        }

        case search.SET_LANGUAGE: {
            return {
                ...state,
                selectedLanguageName: action.payload
            }
        }

        case search.PERFORM_TRANSLATION: {
            let languageName = state.selectedLanguageName;
            state.searchResult.products.forEach(p => {
                setTranslatedDescription(p, languageName);
            });

            return {
                ...state
            }
        }

        case search.SET_CATEGORY_URL: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    categoryUrl: action.payload
                }
            }
        }

        case search.SET_GENERIC_FILTER_VALUE: {
            let searchParams = { ...state.searchParameters };
            let key = action.payload.key;
            searchParams[key] = action.payload.value;

            return {
                ...state,
                searchParameters: searchParams
            }
        }

        case search.UPSERT_GENERIC_FILTER_VALUE: {
            let searchParams = { ...state.searchParameters };
            let key = action.payload.key;
            if (searchParams[key]) {
                searchParams[key] = [...searchParams[key], ...action.payload.value];
            } else {
                searchParams[key] = action.payload.value;
            }

            return {
                ...state,
                searchParameters: searchParams
            }
        }

        case search.REMOVE_GENERIC_FILTER_VALUE: {
            let searchParams = { ...state.searchParameters };
            let key = action.payload.key;

            if (!searchParams[key] || searchParams[key].length <= 1) {
                delete (searchParams[key]);
            } else {
                let index = searchParams[key].findIndex(x => x === action.payload.value[0]);
                if (index > -1) {
                    searchParams[key].splice(index, 1);
                }
            }

            return {
                ...state,
                searchParameters: searchParams
            }
        }

        case search.CLEAR_GENERIC_FILTERS: {
            let defaultParams = new SearchParameters();
            for (let prop in defaultParams) {
                defaultParams[prop] = state.searchParameters[prop];
            }

            return {
                ...state,
                searchParameters: defaultParams
            }
        }

        case search.SET_PROMOTED_FILTERS_INFO: {
            if (!action.payload.length) {
                return state;
            }
            return {
                ...state,
                promotedFiltersInfo: action.payload
            }
        }

        case search.STORE_CURRENT_PRODUCTS: {
            return {
                ...state,
                previousProducts: state.searchResult.products
            }
        }

        case search.APPEND_PRODUCTS: {
            let extendedProducts = [...state.previousProducts, ...state.searchResult.products];
            return {
                ...state,
                searchResult: {
                    ...state.searchResult,
                    products: extendedProducts
                },
                previousProducts: []
            }
        }

        case search.SET_IS_FAVORITE: {
            let products = state.searchResult.products;
            let favoriteProducts = action.payload;

            products.forEach(product => {
                product.isFavorite = favoriteProducts.indexOf(product.id) != -1;
            });

            return {
                ...state,
                searchResult: {
                    ...state.searchResult,
                    products: products
                }
            }
        }


        case search.DELETE_GENERIC_FILTERS_BY_TYPES: {
            action.payload.forEach(typeName => delete (state.searchParameters[typeName]));

            return { ...state };
        }

        case search.SET_KEYWORD: {
            return {
                ...state,
                searchParameters: {
                    ...state.searchParameters,
                    keyword: action.payload
                }
            }
        }

        default: {
            return state;
        }
    }
}

export const getProducts = (state: State) => state.searchResult.products;
export const getSearchParameters = (state: State) => state.searchParameters;
export const selectedCarTypes = (state: State) => state.searchParameters.carTypes;
export const selectedCarModels = (state: State) => state.searchParameters.carModels;
export const getSelectedFormFactor = (state: State) => state.searchParameters.formFactor;
export const getIsRest = (state: State) => state.searchParameters.rest;
export const getTotalCount = (state: State) => state.searchResult.totalCount;

export const getCarTypes = (state: State) => state.carTypes.items;
export const getCarModels = (state: State) => state.carModels.items;

export const getCarTypesFilterParams = (state: State) => new FilterParameters(state.searchParameters.searchPhrase, state.searchParameters.carTypes, state.searchParameters.carModels, state.searchParameters.productLines, state.carTypes.keyword, state.searchParameters.formFactor, state.searchParameters.treeParts);
export const getCarModelsFilterParams = (state: State) => new FilterParameters(state.searchParameters.searchPhrase, state.searchParameters.carTypes, state.searchParameters.carModels, state.searchParameters.productLines, state.carModels.keyword, state.searchParameters.formFactor, state.searchParameters.treeParts);

export const getSortField = (state: State) => state.searchParameters.sortField;
export const getFromField = (state: State) => state.searchParameters.from;
export const getPageSize = (state: State) => state.searchParameters.count;

export const getPromotedFiltersSettings = (state: State) => state.promotedFiltersInfo;

export const getFirstProduct = (state: State) => {
    if (state.searchResult.totalCount === 1) {
        return state.searchResult.products[0];
    }
    return null;
}

export const getFirstFiveProducts = (state: State) => {
    return state.searchResult.products.slice(0, 5);
}

export const getImagesLookup = (state: State) => state.productImagesLookup;
export const getLoadState = (state: State) => state.loadInProcess;