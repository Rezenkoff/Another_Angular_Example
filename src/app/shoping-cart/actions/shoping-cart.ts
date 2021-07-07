import { Action } from '@ngrx/store';
import { CartProduct, Cart } from '../../shoping-cart/models/shoping-cart-product.model';
import { KeyValuePair } from '../../search/models/response-images-products';
import { UserPreferencesModel } from '../../auth/models/user-preferences.model';
import { CurrentUser } from '../../auth/models/current-user.model';
import { Product } from '../../models/product.model';
import { DiscountModel } from '../models/discount.model';

export const ADD_PRODUCT = '[ShopingCart] Add Product';
export const ADD_PRODUCT_SUCCESS = '[ShopingCart] Add Product Success';
export const ADD_PRODUCT_FAIL = '[ShopingCart] Add Product Fail';
export const REMOVE_PRODUCT = '[ShopingCart] Remove Product';
export const REMOVE_PRODUCT_SUCCESS = '[ShopingCart] Remove Product Success';
export const REMOVE_PRODUCT_FAIL = '[ShopingCart] Remove Product Fail';
export const LOAD_CART = '[ShopingCart] Load';
export const LOAD_SUCCESS = '[ShopingCart] Load Success';
export const LOAD_FAIL = '[ShopingCart] Load Fail';
export const SELECT_PRODUCT = '[ShopingCart] Select Product';
export const INCREMENT_SELECTED_PRODUCT_QUANTITY = '[ShopingCart] Increment quantity';
export const DECREMENT_SELECTED_PRODUCT_QUANTITY = '[ShopingCart] Decrement quantity';
export const UPDATE_SELECTED_PRODUCT_QUANTITY = '[ShopingCart] update quantity';
export const UPDATE_SELECTED_PRODUCT_QUANTITY_SUCCESS = '[ShopingCart] update quantity success';
export const UNLOAD_CART = '[ShopingCart] Unload cart';
export const SUCCESS = '[ShopingCart] success';
export const CONCAT_BASKET = '[ConcatBasket] success';
export const UPDATE_QUANTITY_PRODUCTS_ARRAY = '[Array products] update quantity';
export const SUCCESS_UPDATE_QUANTITY_PRODUCTS_ARRAY = '[Array products] success';
export const SET_PRODUCT_IMAGES = '[ShopingCart] Set product images';
export const PERFORM_TRANSLATION = '[ShopingCart] Translate products descriptions';
export const SET_USER_INFO = '[ShopingCart] Set user info';
export const SET_USER_PREFERENCES = '[ShopingCart] Set user preferences';
export const SET_IS_AUTHORIZED = '[ShopingCart] Set isAuthorized';
export const CLEAR_CART = '[ShopingCart] Clear cart';
export const ADD_DISCOUNT = '[ShopingCart] Add discount';
export const SELECT_PRODUCT_FOR_INSTALLING = '[ShopingCart] Select Product For Installing';

export class SuccessAction implements Action {
    readonly type = SUCCESS;

    constructor() { }
}

export class UnloadAction implements Action {
    readonly type = UNLOAD_CART;

    constructor() { }
}

export class SelectProductAction implements Action {
    readonly type = SELECT_PRODUCT;

    constructor(public payload: CartProduct) { }
}

export class UpdateSelectedProductSuccessAction implements Action {
    readonly type = UPDATE_SELECTED_PRODUCT_QUANTITY_SUCCESS;

    constructor(public payload: CartProduct) { }
}

export class IncrementQuantityAction implements Action {
    readonly type = INCREMENT_SELECTED_PRODUCT_QUANTITY;

    constructor(public payload: CartProduct) { }
}

export class DecrementQuantityAction implements Action {
    readonly type = DECREMENT_SELECTED_PRODUCT_QUANTITY;

    constructor(public payload: CartProduct) { }
}

export class UpdateQuantityAction implements Action {
    readonly type = UPDATE_SELECTED_PRODUCT_QUANTITY;

    constructor(public payload: any) { }
}

export class UpdateQuantityArrayAction implements Action {
    readonly type = UPDATE_QUANTITY_PRODUCTS_ARRAY;

    constructor(public payload: any) { }
}

export class SuccessAction_UpdateQuantityArrayAction implements Action {
    readonly type = SUCCESS_UPDATE_QUANTITY_PRODUCTS_ARRAY;

    constructor() { }
}

export class AddProductAction implements Action {
    readonly type = ADD_PRODUCT;

    constructor(public payload: Product) { }
}

export class AddProductSuccessAction implements Action {
    readonly type = ADD_PRODUCT_SUCCESS;

    constructor(public payload: CartProduct) { }
}

export class AddProductFailAction implements Action {
    readonly type = ADD_PRODUCT_FAIL;

    constructor(public payload: CartProduct) { }
}

export class RemoveProductAction implements Action {
    readonly type = REMOVE_PRODUCT;

    constructor(public payload: CartProduct) { }
}

export class RemoveProductSuccessAction implements Action {
    readonly type = REMOVE_PRODUCT_SUCCESS;

    constructor(public payload: CartProduct) { }
}

export class RemoveProductFailAction implements Action {
    readonly type = REMOVE_PRODUCT_FAIL;

    constructor(public payload: CartProduct) { }
}

export class LoadAction implements Action {
    readonly type = LOAD_CART;
}

export class LoadSuccessAction implements Action {
    readonly type = LOAD_SUCCESS;

    constructor(public payload: Cart) { }
}

export class LoadFailAction implements Action {
    readonly type = LOAD_FAIL;

    constructor(public payload: any) { }
}

export class ConcatBasket implements Action {
    readonly type = CONCAT_BASKET;
}

export class SetProductImages implements Action {
    readonly type = SET_PRODUCT_IMAGES;

    constructor(public payload: KeyValuePair[]) { }
}

export class PerformDescriptionsTranslation implements Action {
    readonly type = PERFORM_TRANSLATION;

    constructor(public payload: string) { }
}

export class SetUserInfo implements Action {
    readonly type = SET_USER_INFO;

    constructor(public payload: CurrentUser) { }
}

export class SetUserPreferences implements Action {
    readonly type = SET_USER_PREFERENCES;

    constructor(public payload: UserPreferencesModel) { }
}

export class SetIsAuthorized implements Action {
    readonly type = SET_IS_AUTHORIZED;

    constructor(public payload: boolean) { }
}

export class ClearCart implements Action {
    readonly type = CLEAR_CART;

    constructor() { }
}

export class AddDiscount implements Action {
    readonly type = ADD_DISCOUNT;

    constructor(public discount: DiscountModel) { }
}

export class SelectProductForInstalling implements Action {
    readonly type = SELECT_PRODUCT_FOR_INSTALLING;

    constructor(public payload: any) { }
}

export type Actions =
    AddProductAction
    | AddProductSuccessAction
    | AddProductFailAction
    | RemoveProductAction
    | RemoveProductSuccessAction
    | RemoveProductFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectProductAction
    | IncrementQuantityAction
    | DecrementQuantityAction
    | UpdateQuantityAction
    | UpdateSelectedProductSuccessAction
    | UpdateQuantityArrayAction
    | SuccessAction
    | UnloadAction
    | ConcatBasket
    | SetProductImages
    | PerformDescriptionsTranslation
    | SetUserInfo
    | SetUserPreferences
    | SetIsAuthorized
    | ClearCart
    | AddDiscount
    | SelectProductForInstalling;