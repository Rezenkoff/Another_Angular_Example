import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import * as shopingcart from '../actions/shoping-cart';
import { Cart, CartProduct } from '../models/shoping-cart-product.model';
import { ShopingCartService } from '../services/shoping-cart.service';
import { ShopingCartOperationsService } from '../services/shoping-cart-operations.service';
import { RequestImagesForProducts } from '../../search/models/request-images-products';
import { SearchService } from '../../services/search.service';
import { PixelFacebookService } from '../../services/pixel-facebook.service';

const defaultIconType: number = 0; //img resolution 50x60

@Injectable()
export class ShopingCartEffects {

    @Effect()
    loadProducts$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.LOAD_CART),
            switchMap(() => this._shopingCartService.loadProducts().pipe(
                map((cart: Cart) => new shopingcart.LoadSuccessAction(cart)),
                catchError(error => of(new shopingcart.LoadFailAction(error))))
            ));

    @Effect()
    selectProduct$: Observable<Action> = this.actions$.pipe(
        ofType(shopingcart.ADD_PRODUCT_SUCCESS),
        map((action: shopingcart.SelectProductAction) => action.payload),
        map((p) => new shopingcart.SelectProductAction(p)));

    @Effect()
    addProduct$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.ADD_PRODUCT),
            map((action: shopingcart.AddProductAction) => action.payload),
            mergeMap(product => {
                const cartProduct: CartProduct = new CartProduct(
                    undefined,
                    product.id,
                    product.lookupNumber,
                    product.transliteratedTitle,
                    product.price,
                    product.brand,
                    product.hardPackingRate,
                    product.compulsory = (product.hardPackingRate) ? "1" : null,
                    product.displayDescription,
                    product.cardId,
                    product.productLine,
                    product.displayDescriptionUkr,
                    product.displayDescriptionRus,
                    product.ref_Key,
                    product.weight,
                    product.isExpected,
                    product.supplierProductRef_Key,
                    product.image,
                    product.quantityForDiscount,
                    product.discountPrice,
                    product.isTire ? true : false,
                    product.supplierRef_Key
                );
                cartProduct.quantity=product.isTire?4:1
                return this._shopingCartService.tryAddProduct(cartProduct).pipe(
                    map((prod: CartProduct) => new shopingcart.AddProductSuccessAction(prod)),
                    catchError(_ => of(new shopingcart.AddProductFailAction(cartProduct))))
            }
            ));

    @Effect()
    removeProduct$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.REMOVE_PRODUCT),
            map((action: shopingcart.RemoveProductAction) => action.payload),
            mergeMap(product => this._shopingCartService.removeProduct(product).pipe(map(() => new shopingcart.RemoveProductSuccessAction(product)),
                catchError(() => of(new shopingcart.RemoveProductFailAction(product))))
            ));

    @Effect()
    concatBasket$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.CONCAT_BASKET),
            map((action: shopingcart.ConcatBasket) => action),
            mergeMap(result => this._shopingCartService.UpsertProduct().pipe(
                map(() => new shopingcart.LoadAction()),
                catchError(() => of(new shopingcart.LoadAction())))
            ));

    @Effect()
    clearCart$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.UNLOAD_CART),
            map((action: shopingcart.UnloadAction) => action),
            mergeMap(result => this._shopingCartService.clearCart().pipe(
                map(() => new shopingcart.SuccessAction()))
            ));


    @Effect()
    updateProduct$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.UPDATE_SELECTED_PRODUCT_QUANTITY_SUCCESS),
            map((action: shopingcart.UpdateSelectedProductSuccessAction) => action.payload),
            mergeMap(products => this._shopingCartService.updateProduct(products).pipe(
                map(() => new shopingcart.SuccessAction()))
            ));

    @Effect()
    updateProductArray$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.UPDATE_QUANTITY_PRODUCTS_ARRAY),
            map((action: shopingcart.UpdateQuantityArrayAction) => action.payload),
            mergeMap(products => this._shopingCartService.upsertProductArray(products).pipe(
                map(() => new shopingcart.SuccessAction_UpdateQuantityArrayAction()))
            ));

    @Effect()
    incrementProductQuantity: Observable<Action> =
        this.actions$.pipe(
            ofType(shopingcart.INCREMENT_SELECTED_PRODUCT_QUANTITY),
            map((action: shopingcart.IncrementQuantityAction) => action.payload),
            mergeMap(product =>
                this._operationsService.incrementProductQuantity(product).pipe(
                    map((updatedProd: CartProduct) => new shopingcart.UpdateSelectedProductSuccessAction(updatedProd))
                )));

    @Effect()
    decrementProductQuantity: Observable<Action> =
        this.actions$.pipe(
            ofType(shopingcart.DECREMENT_SELECTED_PRODUCT_QUANTITY),
            map((action: shopingcart.DecrementQuantityAction) => action.payload),
            mergeMap(product =>
                this._operationsService.decrementProductQuantity(product).pipe(
                    map((updatedProd: CartProduct) => new shopingcart.UpdateSelectedProductSuccessAction(updatedProd))
                )));

    @Effect()
    updateProductQuantity: Observable<Action> =
        this.actions$.pipe(
            ofType(shopingcart.UPDATE_SELECTED_PRODUCT_QUANTITY),
            map((action: shopingcart.UpdateQuantityAction) => action.payload),
            mergeMap(obj =>
                this._operationsService.updateProductQuantity(obj.product, obj.quantity).pipe(
                    map((updatedProd: CartProduct) => new shopingcart.UpdateSelectedProductSuccessAction(updatedProd))
                )));

    @Effect() setProductImages$ = this.actions$
        .pipe(
            ofType(shopingcart.LOAD_SUCCESS),
            map((action: shopingcart.LoadSuccessAction) => action.payload),
            mergeMap((payload) => {
                if (payload.products.length == 0) {
                    return of()
                };
                let articlesList = payload.products.map(x => x.articleId);
                let request: RequestImagesForProducts = { icoType: defaultIconType, articles: articlesList };
                return this._searchService.getImagesForProducts(request).pipe(map(response =>
                    new shopingcart.SetProductImages(response.result)));
            }));

    @Effect() setProductImage$ = this.actions$
        .pipe(
            ofType(shopingcart.ADD_PRODUCT),
            map((action: shopingcart.AddProductAction) => action.payload),
            mergeMap((payload) => {
                let id = payload.id;
                let request: RequestImagesForProducts = new RequestImagesForProducts(defaultIconType);
                request.articles.push(id);
                return this._searchService.getImagesForProducts(request).pipe(map(response =>
                    new shopingcart.SetProductImages(response.result)));
            }));

    @Effect() selectProductForInstalling$: Observable<Action> = this.actions$
        .pipe(
            ofType(shopingcart.SELECT_PRODUCT_FOR_INSTALLING),
            map((action: shopingcart.SelectProductForInstalling) => action.payload),
            mergeMap(model => this._shopingCartService.updateProduct(model.product).pipe(
                map(() => new shopingcart.SuccessAction()))
            ));

    constructor(private actions$: Actions,
        private _shopingCartService: ShopingCartService,
        private _operationsService: ShopingCartOperationsService,
        private _searchService: SearchService,
        private _faceBookPixelService: PixelFacebookService
    ) { }
}