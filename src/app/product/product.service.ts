import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { throwError, Observable, Subject, of } from "rxjs";
import { map, catchError, takeUntil, share, tap } from "rxjs/operators";
import { NavigationService } from "../services/navigation.service";
import { Product } from '../models/product.model';
import { setTranslatedDescription, setTranslatedAdditionalInfo } from './product-functions-provider';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { ProductDetail } from '../product/models';

@Injectable()
export class ProductService {

    private _cachedAnalogsForProduct: Array<Product>;
    private _cachedProductId: string;
    private _productDetail$: Observable<any>;
    private canDoQuery: boolean = true;

    constructor(
        private _http: HttpClient,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _navigationService: NavigationService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    public getProductDetails(productId: number)  {
        const params = new HttpParams().set('productId', productId.toString());
        if (!this.canDoQuery) {
            return this._productDetail$;
        } else {
            this.canDoQuery = false;
        }

        this._productDetail$ = this._http.get<ProductDetail>(environment.apiUrl + this._constants.PRODUCT.GETDETAILBYID,  {params}).pipe(
            tap(ev => {this.canDoQuery = true}),
            share(),
            catchError((error: any) => {
                this._navigationService.HandleError(error);
                return throwError(error);
            }));

        return this._productDetail$; 
    }

    public getProductAnalogs(productId: number, artNumber: string, groupId: number, brandId: string, from?: number, pageSize?: number): Observable<Array<Product>> {
        let params = {
            'productId': productId.toString(),
            'artNumber': artNumber,
            'groupId': groupId.toString(),
            'brandId': brandId,
            'from': from || 0,
            'pageSize': pageSize || 20
        };

        if (this._cachedProductId == params.productId) {
            return of(this._cachedAnalogsForProduct);
        }

        this._cachedProductId = params.productId;

        return this._http.post<Array<Product>>(environment.apiUrl + this._constants.PRODUCT.GETANALOGS, JSON.stringify(params)).pipe(
            map(
                resp => {                   
                    this._cachedAnalogsForProduct = resp;
                    return resp;
                }
            ));
    }

    public getProductAnalogsWithCount(productId: number, artNumber: string, groupId: number, brandId: string, from?: number, pageSize?: number) {
        const params = {
            'productId': productId.toString(),
            'artNumber': artNumber,
            'groupId': groupId.toString(),
            'brandId': brandId,
            'from': from || 0,
            'pageSize': pageSize || 20
        };

        this._cachedProductId = params.productId;
        return this._http.post(environment.apiUrl + this._constants.PRODUCT.GETANALOGS, JSON.stringify(params));
    }

    public getProductById(productId: number): Observable<Product> {
        const params = new HttpParams().set(
            'productId', productId.toString());
            

        return this._http.get<Product>(environment.apiUrl + this._constants.PRODUCT.GETPRODUCT, {params});
    }

    public getModification(productId: number, modelId: string) {
        const params = new HttpParams().set('productId', productId.toString()).set('modelId', modelId);

        return this._http.get(environment.apiUrl +'product/modification', {params}).pipe(           
            catchError((error: any) => throwError(error)));
    }

    public setTranslatedDescription(product: Product, languageName: string) {
        setTranslatedDescription(product, languageName);
    }

    public setTranslatedAdditionalInfoForProduct(product: Product, languageName: string) {
        setTranslatedAdditionalInfo(product, languageName);
    }

    public logProductView(productId: number): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        //fire and forget api call
        let destroy = new Subject<boolean>();
        let call = this._http.post(environment.apiUrl + 'product/l', JSON.stringify({productId})).pipe(takeUntil(destroy));
        call.subscribe();
        destroy.next(true);
        destroy.unsubscribe();
    }

    public saveNotifyWhenProductAvailableRequest(artId: number, productName: string, phone: string, email: string, firstLastName: string): Observable<any> {
        const model = { artId, productName, phone, email, firstLastName };
        return this._http.post(environment.apiUrl + 'product/notify-when-available', JSON.stringify(model)).pipe(
            catchError((error: any) => throwError(error)));
    }
}
