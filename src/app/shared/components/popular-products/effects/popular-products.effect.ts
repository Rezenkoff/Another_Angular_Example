import { Injectable } from '@angular/core';
import { PopularProductService } from '../service/popular-products.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as popularProductsActions from '../actions/popular-products.action';
import { mergeMap, map } from 'rxjs/operators';
import { FavoriteProductService } from '../../../../services/favorite-product.service';
import { AuthHttpService } from '../../../../auth/auth-http.service';

@Injectable()
export class PopularProductEffect {

    constructor(private _popularProdectService: PopularProductService,
        private actions$: Actions,
        public _favoriteProductService: FavoriteProductService,
        public _authService: AuthHttpService) {

    }

    @Effect()
    loadProduct$: Observable<Action> = this.actions$.pipe(
        ofType(popularProductsActions.LOAD),
        mergeMap(action =>
            this._popularProdectService.getPopularProducts().pipe(
                mergeMap(products => {
                    let actions: Action[] = [];
                    actions.push(new popularProductsActions.ShowProducts(products));

                    if (this._authService.isAuthenticated() && products.length > 0)
                        actions.push(new popularProductsActions.GetFavorite());

                    return actions;
                })
            )
        ))

    @Effect()
    getFavoriteProducts$: Observable<Action> = this.actions$.pipe(
        ofType(popularProductsActions.GET_IS_FAVORITE),
            mergeMap(action =>
                this._favoriteProductService.loadFavoritProducts().pipe(
                mergeMap(products => {
                    return [new popularProductsActions.GetFavoriteSuccess(products)]
                })
            )))

    @Effect()
    performTranslation$: Observable<Action> = this.actions$
        .pipe(
            ofType(popularProductsActions.SHOW_PRODUCTS),
            map(() => new popularProductsActions.PerformDescriptionsTranslation()));
}

