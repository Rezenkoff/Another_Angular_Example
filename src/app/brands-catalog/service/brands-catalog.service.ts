import { Brand } from "../models/brand.model";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { SearchParameters } from "../../search/models";
import { APP_CONSTANTS, IAppConstants } from "../../config";
import { Inject, Injectable } from "@angular/core";
import { tap, catchError } from "rxjs/operators";
import { FilterTypesEnum } from "../../filters/models/filter-types.enum";
import { BrandNode } from "../models/brand-node.model";
import { environment } from '../../../environments/environment';
import { BrandTopProductModel } from '../models/brand-top-product.model'

const LRU = require("lru-cache");
const brandFilterKey: string = FilterTypesEnum[FilterTypesEnum.Uncategorized_Manufacturer];

@Injectable()
export class BrandsCatalogService {

    private cache: any;
    private _allBrands: Brand[] = [];
    private _brands$: BehaviorSubject<Brand[]> = new BehaviorSubject<Brand[]>([]);

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _http: HttpClient,
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public getAllBrands(): Observable<Brand[]> {
        this._http.get<Brand[]>(environment.apiUrl + 'brands/get').subscribe(data => {
            this._allBrands = data;
            this._brands$.next(this._allBrands);
        });

        return this._brands$;
    }

    public getBrandsCatalog(brandUrl: string): Observable<BrandNode[]> {
        let cacheKey: string = brandUrl;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            this._allBrands = cached;
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let searchParams = new SearchParameters();
        searchParams[brandFilterKey] = [this.getIdFromUrl(brandUrl)];

        return this._http.post<BrandNode[]>(environment.apiUrl + 'brands/get-nodes-tree', JSON.stringify(searchParams)).pipe(
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getIdFromUrl(url: string): number {
        let startIdx = url.indexOf('-id') + 3;
        let endInx = url.length;
        return Number(url.substring(startIdx, endInx));
    }

    public applyFilter(searchString: string): void {
        const filteredBrands = (searchString) ?
            this._allBrands.filter(x => x.name.toLowerCase().includes(searchString.toLowerCase())) :
            this._allBrands;

        this._brands$.next(filteredBrands);
    }

    public getBrandByUrl(url: string): Observable<Brand> {
        if (url) {
            let cacheKey = "getBrandByUrl" + url;
            var cached = this.cache.get(cacheKey);
            if (cached) {
                return new Observable((observer) => {
                    observer.next(cached);
                    observer.complete();
                });
            }

            const brandId = this.getIdFromUrl(url);
            return this._http.get<Brand>(environment.apiUrl + 'brands/get/' + brandId).pipe(
                tap(data => {
                    return this.cache.set(cacheKey, data)
                }),
                catchError((error: any) => { return throwError(error) }));
        }
        else {
            return null;
        }
    }

    public getTopProducts(brandUrl: string): Observable<BrandTopProductModel[]> {
        const brandId = this.getIdFromUrl(brandUrl);
        return this._http.get<BrandTopProductModel[]>(environment.apiUrl + 'brands/get/top-products/' + brandId).pipe(
            catchError((error: any) => { return throwError(error) }));
    }
}