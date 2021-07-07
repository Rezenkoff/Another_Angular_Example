import { Injectable, Inject } from '@angular/core';
import { SeoPageModel } from '../models/models_seo';
import { Observable } from "rxjs";
import { MainUrlParser, IUrlParser } from '../app-root/main-url.parser';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class SeoTagsService {

    constructor(        
        private _http: HttpClient,
        @Inject(MainUrlParser) private urlParser: IUrlParser,
    ) {
        
    }

    public GetPageTagsAndTitle(pageIdentificator: any, lngId: number, filterKeys: string[] = null): Observable<any> {  

        const parameters = {
            'PageIdentificator': pageIdentificator.id, 
            'PageType': pageIdentificator.type, 
            'Categoriable': pageIdentificator.category, 
            'LanguageId': lngId,
            'filterUrls': filterKeys
        };

        return this._http.post(environment.apiUrl + 'metaservice/tags', JSON.stringify(parameters) );
    }

    public GetPageText(pageIdentificator: any): Observable<string> {

        const params = {
            'PageIdentificator': pageIdentificator.id,
            'PageType': pageIdentificator.type,
            'Categoriable': pageIdentificator.category
        };

        return this._http.post(environment.apiUrl + 'metaservice/pageText', params, { responseType: 'text' });
    }
    
    public GetSeoPageByUrlEnding(urlEnding: string): Observable<string> {
        let pageIdentificator = this.urlParser.parseUrlForID(urlEnding) || { id: 0, type: 0, category: -1 };
        return this.GetPageText(pageIdentificator);
    }

    public GetSeoPage(pageIdentificator: any): Observable<SeoPageModel> {

        const params = new HttpParams()
        .set('PageIdentificator', pageIdentificator.id)
        .set('PageType', pageIdentificator.type)
        .set('Categoriable', pageIdentificator.category);

       return this._http.post<SeoPageModel>(environment.apiUrl + 'metaservice/page', { params });
    }

    public GetSeoTextByUrl(urlEnding: string, filterKeys: string[]): Observable<any>  {
        let pageIdentificator = this.urlParser.parseUrlForID(urlEnding) || { id: 0, type: 0, category: -1 };
        let parameters = {
            'PageIdentificator': pageIdentificator.id,
            'PageType': pageIdentificator.type,
            'Categoriable': pageIdentificator.category,
            'filterKeys': filterKeys
        };

        const headers = new HttpHeaders();
        const params = JSON.stringify(parameters);    

        return this._http.post<string>(environment.apiUrl + 'metaservice/filtertext', params, { headers, responseType: 'text' as 'json' } );
    }

    public GetTextcategoryBrand(urlEnding, brand): Observable<string> {
        let categoryInfo = this.urlParser.parseUrlForID(urlEnding);
        let brandInfo = this.urlParser.parseUrlForID(brand);

        const headers = new HttpHeaders();
        let parameters = { 'categoryId': categoryInfo.id, 'brandId': brandInfo.id };
        const params = JSON.stringify(parameters);

        return this._http.post<string>(environment.apiUrl + 'metaservice/brandCategory', params, { headers, responseType: 'text' as 'json' });
    }
}