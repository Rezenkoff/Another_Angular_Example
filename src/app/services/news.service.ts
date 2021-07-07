import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { News } from '../models/news.model';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class NewsService {
    constructor(
        private _http: HttpClient,
        private _languageService: LanguageService
        ) {
    }

    public getNews(pageIndex: number, pageSize: number, languageId: number = 0, onlyActive: boolean = false) {
     
        const params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString())
            .set('languageId', languageId.toString())
            .set('onlyActive', onlyActive.toString());        
       
        return this._http.get(environment.apiUrl + 'news/get', { params })
            .pipe(catchError((error: any) => throwError(error)));
    }

    public getLatestNews() {
        let lng = this._languageService.getSelectedLanguage();

        const params = new HttpParams()           
            .set('languageId', lng.id.toString());

        return this._http.get(environment.apiUrl + 'news/latest', {params}).pipe(map((resp) => resp));
    }

    public getNewsById(id: number) {
        
        const params = new HttpParams()           
            .set('id', id.toString());

        return this._http.get(environment.apiUrl + 'news/byId', {params}).pipe(
            map((resp) => resp ));
    }    

    private PrepareYouTubeLink(content: string) {
        return content.replace('watch?v=', 'embed/');
    }
}