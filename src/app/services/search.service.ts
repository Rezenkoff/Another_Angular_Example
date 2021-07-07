import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { Observable, throwError, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { NavigationService } from "./navigation.service";
import { Product } from '../models/product.model';
import { RequestImagesForProducts } from '../search/models/request-images-products';
import { ResponseImagesForProducts } from '../search/models/response-images-products';
import { SearchParameters as SearchParamsModel, SearchResult } from '../search/models';
import { PackingRateRequest } from '../search/models';
import { Rest } from '../search/models/rest.model';
import { BalanceDetail } from '../search/models/balance-detail.model';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable()
export class SearchService {
    cache: any;
    lastFiveProducts: Array<Product>; 
    private readonly CONTENT_TYPE:string = 'Content-Type';
    private readonly MIME_TYPE:string = 'application/json';

    constructor(
        private _navigationService: NavigationService,
        private _http: HttpClient,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public search(searchParameters) {
        return this._http.post(environment.apiUrl + this._constants.SEARCH.URL, JSON.stringify(searchParameters)).pipe(
            map(resp => resp),
            catchError(error => {
                this._navigationService.HandleError(error);
                return throwError(error);
            }))
    }

    public setCacheProduct(item: Product) {
        let existing = this.cache.get(item.id.toString());
        if (existing) {
            return;
        }
        this.cache.set(item.id.toString(), item);
    }

    public getCacheProduct(id: string) {
        return this.cache.get(id);
    }

    public getChacheProducts() {
        let products = this.cache.values();
        if (products) {
            if (products.length < 6) {
                of(products);
            }
            else {
                let lastProducts = products.slice(0, 5);
                of(lastProducts);
            }
        }
        else {
            of([]);
        }
    }

    public getPackingRates(requestModel: PackingRateRequest) {       
        const headers = new HttpHeaders().set(this.CONTENT_TYPE, this.MIME_TYPE);

        requestModel.listIds = requestModel.listIds.filter(x => x != null);
        if (requestModel.listIds.length === 0)
            return of([]);

        return this._http.post(environment.apiUrl + 'product/populate/packings', JSON.stringify(requestModel), { headers: headers}).pipe(           
            catchError((error: any) => { return throwError(error); }))
    }

    public getManufacturersList(model) {
        let headers = new Headers();
        headers.set(this.CONTENT_TYPE, this.MIME_TYPE);

        return this._http.post(environment.apiUrl + 'search/manufacturers', JSON.stringify(model)).pipe(
            map(resp => resp),
            catchError(error => {
                return throwError(error);
            }))
    }

    public getCarTypesList(model) {
        return this._http.post(environment.apiUrl + 'search/cartypes', JSON.stringify(model)).pipe(
            map(resp => resp),
            catchError(error => {
                return throwError(error);
            }))
    }

    public getCarModelsList(model) {
        return this._http.post(environment.apiUrl + 'search/carmodels', JSON.stringify(model)).pipe(
            map(resp => resp),
            catchError(error => {
                return throwError(error);
            }))
    }

    public getPrices(articles) : Observable<BalanceDetail> {     
        return this._http.post<BalanceDetail>(environment.apiUrl + 'search/prices', JSON.stringify(articles));        
    }

    //this endpint is only for product card coz it is mapped inside nginx
    public getCachedOrOriginalPrices(articles) : Observable<BalanceDetail> {
        return this._http.post<BalanceDetail>(environment.apiUrl + 'search/articles/prices', JSON.stringify(articles)).pipe(
                map(p => p),
                catchError(error => throwError(error)))
        .pipe(            
            catchError(error => throwError(error))
        );
    }

    //this endpint is only for product card coz it is mapped inside nginx
    public getCachedOrOriginalRests(articles) {
        return this._http.post(environment.apiUrl + 'search/articles/rests', JSON.stringify(articles)).pipe(
            catchError(error => throwError(error)))
    }

    public getRests(articles) : Observable<Rest[]> {
        return this._http.post<Rest[]>(environment.apiUrl + 'search/rests', JSON.stringify(articles)).pipe(
            catchError(error => throwError(error)))
    }

    // public getMergedArticlePriceResult(data: any[]): BalanceDetail {
    //     let balanceDetail = data[0] as BalanceDetail;
    //     let prices = balanceDetail.prices;
    //     let discounts = data[1] as Discount[];
    //     balanceDetail.prices = this.getMergedPriceResult([prices, discounts]);
    //     return balanceDetail;
    // }

    // public getMergedPriceResult(data: any[]): Price[] {
    //     let prices = data[0] as Price[];
    //     let discounts = data[1] as Discount[];

    //     if (!discounts) {
    //         return prices;
    //     }

    //     prices.map(price => {
    //         let discount = discounts.find(discount => discount.articleId == price.articleId);
    //         price.oldPrice = (discount) ? Number((price.customerPrice / discount.discountRate).toFixed(2)) : 0;
    //     });

    //     return prices;
    // }

    public getImagesForProducts(requestImages: RequestImagesForProducts): Observable<ResponseImagesForProducts> {
        return this._http.post<ResponseImagesForProducts>(environment.apiUrl + 'product/images', requestImages);
    }

    public searchWithGenericFilter(searchParameters: SearchParamsModel) : Observable<SearchResult> {
        let requestModel = {
            categoryUrl: searchParameters.categoryUrl,
            searchParametersJson: JSON.stringify(searchParameters)
        }
        
        return this._http.post<SearchResult>(environment.apiUrl + 'search/filtered', requestModel).pipe(
            map(resp => resp),
            catchError(error => {
                this._navigationService.HandleError(error);
                return throwError(error)
            }))

        return null;
    }

    public searchRecommendProducts(searchParameters: SearchParamsModel): Observable<SearchResult> 
    {
        return this._http.post<SearchResult>(environment.apiUrl + 'search/recommend', JSON.stringify(searchParameters)).pipe(
            catchError(error => throwError(error)));
    }

    public hasGenericFilters(searchParams: SearchParamsModel): boolean {
        let defaultParams: SearchParamsModel = new SearchParamsModel();

        for (let prop in searchParams) {
            if (defaultParams[prop] === undefined) {
                return true;
            }
        }

        return false;
    }
}