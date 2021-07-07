import { Product } from "../../../../models";
import * as popularProductsActions from '../actions/popular-products.action';
import { setTranslatedDescription } from '../../../../product/product-functions-provider';


export interface PopularProductsState {
    loadProducts: boolean,
    products: Product[],
    selectedLanguageName: string
}

const initialState: PopularProductsState = {
    loadProducts: false,
    products: [],
    selectedLanguageName: 'RUS'
}

export function reducer(state = initialState, action: popularProductsActions.Actions): PopularProductsState {
    switch (action.type) {
        case popularProductsActions.LOAD: {
            return {
                ...state,
                loadProducts: true
            };
        }

        case popularProductsActions.GET_IS_FAVORITE_SUCCESS: {
            let _products = [...state.products];

            _products.forEach(product => {
                let isFavorite = action.payload.find(y => y == product.id);
                product.isFavorite = isFavorite ? true : false;

            });

            return {
                ...state,
                products: _products
            }
        }

        case popularProductsActions.SHOW_PRODUCTS: {
            return {
                ...state,
                products: action.payload,
                loadProducts: false
            };
        }

        case popularProductsActions.SET_LANGUAGE: {
            return {
                ...state,
                selectedLanguageName: action.payload
            }
        }

        case popularProductsActions.PERFORM_TRANSLATION: {
            let languageName = state.selectedLanguageName;
            state.products.forEach(p => {
                setTranslatedDescription(p, languageName);
            });

            return {
                ...state
            }
        }

        default: {
            return state;
        }
    }
}

export const getProducts = (state: PopularProductsState) => state.products;
export const getLoadShowProducts = (state: PopularProductsState) => state.loadProducts;