import * as shopingcart from '../actions/shoping-cart';
import { CartProduct, Cart } from '../models/shoping-cart-product.model';
import { KeyValuePair } from '../../search/models/response-images-products';
import { setTranslatedDescription } from '../../product/product-functions-provider';
import { UserPreferencesModel } from '../../auth/models/user-preferences.model';
import { ClientInfo } from '../../order-step/models/client-info.model';
import { DiscountModel } from '../models/discount.model';
import { DiscountType } from '../models/discount-type.enum';

export interface State {
    loaded: boolean;
    loading: boolean;
    cart: Cart;
    selectedProductId: number | null;
    selectedLanguageName: string;
    isAuthorized: boolean;
    clientInfo: ClientInfo;
    userPreferences: UserPreferencesModel;
    discount: DiscountModel;
}

const initialState: State = {
    loaded: false,
    loading: false,
    cart: new Cart([], 0, 0, 0),
    selectedProductId: null,
    selectedLanguageName: '',
    isAuthorized: false,
    clientInfo: null,
    userPreferences: new UserPreferencesModel(),
    discount: null,
};

export const calculateTotalSum = (products: Array<CartProduct>): number => {
    let total: number = 0;

    if (products.length == 0)
        return total;

    total = products.map((p) => p.price * p.quantity).reduce((p, n) => p += n);

    return total;
}

export const calculateTotalSumWithDiscount = (products: Array<CartProduct>, discount: DiscountModel): number => {
    let total: number = 0;

    if (products.length == 0)
        return total;

    total = products.map((p) => p.price * p.quantity).reduce((p, n) => p += n);

    if (discount && discount.size && discount.typeDiscount) {
        if (discount.typeDiscount === DiscountType.FixPrice) {
            total -= discount.size;
        }
        if (discount.typeDiscount === DiscountType.Percent) {
            total -= total * (discount.size / 100);
        }
    }

    return total;
}

export function reducer(state = initialState, action: shopingcart.Actions): State {
    switch (action.type) {

        case shopingcart.CLEAR_CART:
        case shopingcart.UNLOAD_CART: {
            return {
                ...state,
                loaded: false,
                loading: false,
                cart: new Cart([], 0, 0, 0),
                selectedProductId: null,
                discount: null
            };
        }

        case shopingcart.LOAD_CART: {
            return {
                ...state,
                loading: true,
            };
        }

        case shopingcart.LOAD_SUCCESS: {

            let discount = state.discount;

            return {
                ...state,
                loaded: true,
                loading: false,
                cart: {
                    products: action.payload.products,
                    totalItems: action.payload.products.length,
                    totalCartSum: calculateTotalSum(action.payload.products),
                    totalCartSumWithDiscount: calculateTotalSumWithDiscount(action.payload.products, discount)
                },
                selectedProductId: null,
                selectedLanguageName: ''
            };
        }
        case shopingcart.ADD_PRODUCT_SUCCESS:
        case shopingcart.REMOVE_PRODUCT_FAIL: {
            if (state.cart.products.map(i => i.articleId).indexOf(action.payload.articleId) > -1) {
                return state;
            }

            let discount = state.discount;

            return {
                ...state,
                cart: {
                    ...state.cart,
                    products: [...state.cart.products, action.payload].sort((a, b) => a.articleId - b.articleId),
                    totalItems: [...state.cart.products, action.payload].length,
                    totalCartSum: calculateTotalSum([...state.cart.products, action.payload]),
                    totalCartSumWithDiscount: calculateTotalSumWithDiscount([...state.cart.products, action.payload], discount)
                }
            };
        }

        case shopingcart.REMOVE_PRODUCT_SUCCESS:
        case shopingcart.ADD_PRODUCT_FAIL: {

            let discount = state.discount;

            return {
                ...state,
                cart: {
                    ...state.cart,
                    products: state.cart.products.filter(p => p.articleId !== action.payload.articleId).sort((a, b) => a.articleId - b.articleId),
                    totalItems: state.cart.products.filter(p => p.articleId !== action.payload.articleId).length,
                    totalCartSum: calculateTotalSum(state.cart.products.filter(p => p.articleId !== action.payload.articleId)),
                    totalCartSumWithDiscount: calculateTotalSumWithDiscount(state.cart.products.filter(p => p.articleId !== action.payload.articleId), discount)
                }
            };
        }

        case shopingcart.UPDATE_SELECTED_PRODUCT_QUANTITY_SUCCESS: {
            if (!state.selectedProductId) {
                return state;
            }

            let prodToUpd = state.cart.products.filter(item => item.articleId == state.selectedProductId)[0];

            let productsNew = state.cart.products.filter(p => p.articleId !== state.selectedProductId).concat(action.payload).sort((a, b) => a.articleId - b.articleId);

            let discount = state.discount;

            return {
                ...state,
                cart: {
                    ...state.cart,
                    products: productsNew,
                    totalCartSum: calculateTotalSum(productsNew),
                    totalCartSumWithDiscount: calculateTotalSumWithDiscount(productsNew, discount)
                }
            };
        }

        case shopingcart.UPDATE_QUANTITY_PRODUCTS_ARRAY: {
            if (!state.selectedProductId) {
                return state;
            }

            let productsNew = state.cart.products.filter(p =>
                p.quantity !== 0)

            let discount = state.discount;

            return {
                ...state,
                cart: {
                    ...state.cart,
                    products: productsNew,
                    totalCartSum: calculateTotalSum(productsNew),
                    totalItems: productsNew.length,
                    totalCartSumWithDiscount: calculateTotalSumWithDiscount(productsNew, discount)
                }
            };
        }

        case shopingcart.SELECT_PRODUCT: {
            if (!action.payload)
                return {
                    ...state,
                    selectedProductId: null
                };

            if (state.cart.products.map(i => i.articleId).indexOf(action.payload.articleId) > -1) {
                return {
                    ...state,
                    selectedProductId: action.payload.articleId   

                };
            }
        }

        case shopingcart.SET_PRODUCT_IMAGES: {
            let imagesList = action.payload as KeyValuePair[];

            if (!imagesList || !imagesList.length) {
                return state;
            }

            let products = [...state.cart.products];

            for (let product of products) {
                let result = imagesList.find(x => x.key == product.articleId);
                if (result) {
                    product.image = result.value;
                    let index = products.indexOf(product);
                    products[index] = product;
                }
            }

            return {
                ...state,
                cart: {
                    ...state.cart,
                    products: products
                }
            }
        }

        case shopingcart.PERFORM_TRANSLATION: {
            let languageName = action.payload;
            state.cart.products.forEach(p => {
                setTranslatedDescription(p, languageName);
            });

            return {
                ...state
            }
        }

        case shopingcart.SET_USER_INFO: {

            let clientInfo = new ClientInfo();
            clientInfo.Phone = action.payload.phone;
            clientInfo.Email = action.payload.email;
            clientInfo.FirstLastName = action.payload.name;
            clientInfo.IsAgreed = action.payload.isOfferAgreed;

            return {
                ...state,
                clientInfo: clientInfo
            }
        }

        case shopingcart.SET_USER_PREFERENCES: {
            return {
                ...state,
                userPreferences: action.payload
            }
        }

        case shopingcart.SET_IS_AUTHORIZED: {
            return {
                ...state,
                isAuthorized: action.payload
            }
        }

        case shopingcart.ADD_DISCOUNT: {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    totalCartSumWithDiscount: calculateTotalSumWithDiscount([...state.cart.products], action.discount)
                },
                discount: action.discount
            }
        }

        case shopingcart.SELECT_PRODUCT_FOR_INSTALLING: {

            let products = [...state.cart.products];

            products.filter(x => x.articleId === action.payload.product.articleId).forEach(x => x.isNeedToInstall = action.payload.isNeedToInstall);

            return {
                ...state,
                cart: {
                    ...state.cart,
                    products: products
                }
            }
        }

        default: {
            return state;
        }
    }
}

export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getCart = (state: State) => state.cart;
export const getSelectedProduct = (state: State) => state.cart.products.filter(item => item.articleId == state.selectedProductId)[0];
export const getTotalItems = (state: State) => state.cart.totalItems;
export const getTotalCartSum = (state: State) => state.cart.totalCartSum;
export const getCurrentUser = (state: State) => state.clientInfo;
export const getUserPreferences = (state: State) => state.userPreferences;
export const getIsAuthorized = (state: State) => state.isAuthorized;
export const getTotalCartSumWithDiscount = (state: State) => state.cart.totalCartSumWithDiscount;
export const getDiscountAmount = (state: State) => state.cart.totalCartSum - state.cart.totalCartSumWithDiscount;
export const getDiscount = (state: State) => state.discount;
