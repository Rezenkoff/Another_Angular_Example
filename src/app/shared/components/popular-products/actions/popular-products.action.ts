import { Action } from '@ngrx/store';
import { Product } from '../../../../models';
import { Price } from '../../../../search/models';
import { KeyValuePair } from '../../../../search/models/response-images-products';

export const LOAD = '[PopularProductsState] load popular products';
export const SHOW_PRODUCTS = '[PopularProductsState] show popular products';
export const GET_IS_FAVORITE = '[PopularProductsState] load favorite';
export const GET_IS_FAVORITE_SUCCESS = '[PopularProductsState] load favorite success';
export const SET_LANGUAGE = '[PopularProductsState] set selected language';
export const PERFORM_TRANSLATION = '[PopularProductsState] translate product titles';

export class Load implements Action {
    readonly type = LOAD;

    constructor() { }
}

export class ShowProducts implements Action {
    readonly type = SHOW_PRODUCTS;

    constructor(public payload: Product[]) { }
}

export class GetFavorite implements Action {
    readonly type = GET_IS_FAVORITE;

    constructor() { }
}

export class GetFavoriteSuccess implements Action {
    readonly type = GET_IS_FAVORITE_SUCCESS;

    constructor(public payload: number[]) { }
}

export class SetSelectedLanguage implements Action {
    readonly type = SET_LANGUAGE;

    constructor(public payload: string) { }
}

export class PerformDescriptionsTranslation implements Action {
    readonly type = PERFORM_TRANSLATION;

    constructor() { }
}

export type Actions =
    Load
    | ShowProducts
    | GetFavorite
    | GetFavoriteSuccess
    | SetSelectedLanguage
    | PerformDescriptionsTranslation;