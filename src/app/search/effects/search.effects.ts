
import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Action, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of, EMPTY } from 'rxjs';
import { map, withLatestFrom, mergeMap, switchMap, finalize, catchError, debounceTime, distinctUntilChanged, share, tap } from 'rxjs/operators';
import * as search from '../actions/search.actions';
import {FavoriteProductService } from '../../services/favorite-product.service';
import { SearchService } from '../../services/search.service';
import { GtagService } from '../../services/gtag.service'
import { AreaService } from '../../location/area/area.service';
import { LanguageService } from '../../services/language.service';
import {  KeyValueModel } from '../../models';
import * as fromSearch from '../reducers';
import { SearchResult, SearchParameters } from '../models';
import { ArticleBalanceDetail } from '../../models/article-balance-detail.model';
import { Router } from '@angular/router';

//img resolution 200x240
const defaultIconType: number = 1; 

@Injectable()
export class SearchEffects {

    loadProducts$ =  createEffect(() => this.actions$.pipe(   
        ofType(search.SEARCH, search.CANCEL_SEARCH),
        map((action:Action) => action),     
        withLatestFrom(this.store.select(fromSearch.getSearchParameters)),        
        switchMap(([action, state]) => action.type === search.CANCEL_SEARCH ? 
            EMPTY :
            this._searchService.searchWithGenericFilter(state).pipe(
                map((result: SearchResult) => new search.SetSuccessResultAction(result)),
                catchError(error => { 
                    return of(new search.SetErrorResultAction()); 
                }
            ))
    )
    ));  
    
    setNearestStore$ =  createEffect(() => this.actions$.pipe(
            ofType(search.SEARCH),
            switchMap(() => this._areaService.getNearestStoreAreaName()),
            map(([action, areaName]) => {
                return new search.SetNearestStoreAction(areaName)
            })
            ));

    loadPrices$ =  createEffect(() => this.actions$.pipe(
           ofType(search.SET_SUCCESS_RESULT),
           map((action: search.SetSuccessResultAction) => action.payload),
            mergeMap((searchResult: SearchResult) => 
                this._searchService.getPrices(new ArticleBalanceDetail(searchResult.products.map(c => c.id), searchResult.products.filter(c => c.isExpected == -1).map(c => c.id)))
                .pipe(
                    finalize(() => {
                        this._gtagService.sendRemarketingEventForSearch();                        
                        var pagetype = this._route.routerState.snapshot.url;
                        if (pagetype.startsWith('/search-result') || pagetype.startsWith('/category')) {
                            var page = pagetype.startsWith('/search-result') ? 'searchresults' : 'category';
                            this._gtagService.setDataLayer(searchResult.products, page);
                        }
                    }
                    ),
                   map((prices) => new search.SetSuccessPrices(prices))
                )
            )
            ));   
            
    loadRests$: Observable<Action> =  createEffect(() => this.actions$.pipe(
        ofType(search.SET_SUCCESS_RESULT),
        map((action: search.SetSuccessResultAction) => action.payload),
            mergeMap(searchResult => this._searchService.getRests(searchResult.products.map(p => p.id)).pipe(
            map((rests) => new search.SetSuccessRests(rests)))
        )));
    
    setLanguage$: Observable<Action> =  createEffect(() => this.actions$
        .pipe(
            ofType(search.SEARCH),
            map(() => {            
                let language = this._languageService.getSelectedLanguage();
                let langName = (language) ? language.name : 'RUS';
                return new search.SetSelectedLanguage(langName);
        })));

    performTranslation$: Observable<Action> =  createEffect(() => this.actions$
        .pipe(
            ofType(search.SET_SUCCESS_RESULT),
            map((action: search.SetSuccessResultAction) => new search.PerformDescriptionsTranslation())));

    
    searchCarTypes$: Observable<Action> =  createEffect(() => this.actions$
        .pipe(
            ofType(search.SEARCH_CAR_TYPES),
            debounceTime(1000),
            distinctUntilChanged(),
            withLatestFrom(this.store.select(fromSearch.getCarTypesParameters)),
            switchMap(([action, state]) => this._searchService.getCarTypesList(state).pipe(
                map((carTypes: KeyValueModel[]) => new search.SetSuccessCarTypesResultAction(carTypes))
            ))));
   
    resetCarTypesFilter$: Observable<Action> =  createEffect(() => this.actions$
        .pipe(
            ofType(search.RESET_CAR_TYPES_FILTER),
            withLatestFrom(this.store.select(fromSearch.getCarTypesParameters)),
            switchMap(([action, state]) => this._searchService.getCarTypesList(state).pipe(
                map((carTypes: KeyValueModel[]) => new search.SetSuccessCarTypesResultAction(carTypes))
            ))));
    
    searchCarModels$: Observable<Action> =  createEffect(() => this.actions$
        .pipe(
            ofType(search.SEARCH_CAR_MODELS),
            debounceTime(1000),
            distinctUntilChanged(),
            withLatestFrom(this.store.select(fromSearch.getCarModelsParameters)),
            switchMap(([action, state]) => this._searchService.getCarModelsList(state).pipe(
                map((carModels: KeyValueModel[]) => new search.SetSuccessCarModelsResultAction(carModels)))
            )));
    
    setProducts$ =  createEffect(() => this.actions$
        .pipe(
            ofType(search.SET_SUCCESS_RESULT),
            map(action => ({
                type: 'SET_PRODUCT_EFFECT'
            }),
        share()
    )));
     
    setSearchParameters$ = createEffect(() => this.actions$
        .pipe(
            ofType(search.SET_SEARCH_PARAMETERS, 
                search.SET_SEARCH_PHRASE, 
                search.SET_FROM_FIELD, 
                search.SET_PAGE_SIZE, 
                search.SET_SORT_FIELDS, 
                search.SET_CATALOG_ID ),
            map(action => ({
                type: 'SET_SEARCH_PARAMETERS_EFFECT'
            }),
            share()
    )));   
     

    setRobotsTag$ = createEffect(
        () => this.actions$.pipe(
          ofType(search.SET_SUCCESS_RESULT),
          withLatestFrom(this.store.select(fromSearch.getSearchParameters)),
          tap(([action, state]) => {
            if ((!(action as search.SetSuccessResultAction).payload ||
                (action as search.SetSuccessResultAction).payload.totalCount == 0) &&
                this._searchService.hasGenericFilters(state as SearchParameters)) {
                this._meta.updateTag({ name: "robots", content: "noindex, nofollow" });
            }})),
        { dispatch: false }
      );

     loadMore$ =  createEffect(() => this.actions$
        .pipe(
            ofType(search.LOAD_MORE_PRODUCTS),
            withLatestFrom(this.store.select(fromSearch.getSearchParameters)),
            switchMap(([action, searchParams]) => [            
                new search.StoreCurrentProducts(),            
                new search.SetFromField(searchParams.from + searchParams.count), 
                new search.SearchAction()            
            ]))
            );
    
    appendProducts$ =  createEffect(() => this.actions$
        .pipe(   
            ofType(search.SET_SUCCESS_RESULT),     
            map(payload => new search.AppendProducts())));
   
    setFavoriteProducts$ =  createEffect(() => this.actions$
        .pipe(
            ofType(search.SET_SUCCESS_RESULT),
            mergeMap(() => {
                return this._favoriteProductService.loadFavoritProducts().pipe(map(products =>
                    new search.SetIsFavorite(products)));             
            })));  

    constructor(private actions$: Actions,
        private _searchService: SearchService,
        private _gtagService: GtagService,
        private _areaService: AreaService,
        private _languageService: LanguageService,
        public _favoriteProductService: FavoriteProductService,
        private store: Store<fromSearch.State>,
        private _meta: Meta,
        private _route: Router
    ) {
    }
}