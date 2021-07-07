import { map, catchError, tap } from "rxjs/operators";
import { throwError, of, Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from "@angular/core";
import { LinkedCategory } from "../models/banner/linked-category.model";
import { LanguageService } from "./language.service";
import { IAppConstants, APP_CONSTANTS } from "../config";
import { UpsertBannerModel } from "../models/banner/UpsertBannerModel";
import { environment } from "../../environments/environment";

const LRU = require("lru-cache");

@Injectable()
export class BannersService {

    private cache: any;

    constructor(
        private _http: HttpClient,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _languageService: LanguageService) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public GetBanners() {

        let languageId = this._languageService.getSelectedLanguage();
        
        const params = new HttpParams()
            .set('languageId', languageId.id.toString());
        
        return this._http.get(environment.apiUrl + 'banner/get', { params }).pipe(            
            catchError((error: any) => throwError(error))
        );
    }
    
    public UpdateBanners(banner: UpsertBannerModel) {
        return this._http.post<UpsertBannerModel>(environment.apiUrl + 'banner/update', JSON.stringify(banner)).pipe(
            
            map((resp) => resp),
            catchError((error: any) => throwError(error)));
    }

    public GetLinkedCategory(bannerId: number) : Observable<Array<LinkedCategory>> {
        return this._http.post<Array<LinkedCategory>>(environment.apiUrl + 'banner/linkedCategory', JSON.stringify(bannerId)).pipe(            
            catchError((error: any) => throwError(error)));
    }

    public AddLinkCategory(bannerId: number, nodeId: number) {
        return this._http.post(environment.apiUrl + 'banner/addLink', JSON.stringify({ bannerId: bannerId, nodeId: nodeId })).pipe(            
            catchError((error: any) => throwError(error)));
    }

    public RemoveLinkedCategory(bannerId: number, nodeId: number) {
        return this._http.post(environment.apiUrl + 'banner/removeLink', JSON.stringify({ bannerId: bannerId, nodeId: nodeId })).pipe(            
            catchError((error: any) => throwError(error))
        );
    }

    public GetBannersWithCategory() {
        let languageId = this._languageService.getSelectedLanguage();

        var cacheKey = `bannersWithCategory_${languageId.id}`;
        var cached = this.cache.get(cacheKey);
        if (cached)
            return of(cached);

        let params = new HttpParams().set("languageId", languageId.id.toString());

        //add transfer
        return this._http.get(environment.apiUrl + 'banner/bannersWithCategory', { params }).pipe(
            tap(data => this.cache.set(cacheKey, data)),
            catchError((error: any) => throwError(error)));
    }

    public GetUpsertBanner(bannerId: number) : Observable<UpsertBannerModel> {
        return this._http.post<UpsertBannerModel>(environment.apiUrl + 'banner/getUpsertBanner', JSON.stringify(bannerId)).pipe(           
            catchError((error: any) => throwError(error)));
    }
}
