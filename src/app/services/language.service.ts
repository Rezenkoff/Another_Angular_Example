import { Injectable, Inject, PLATFORM_ID, EventEmitter } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { ServerParamsTransfer } from '../server-params-transfer.service';
import { Language } from '../models/language.model';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class LanguageService {

    public languageKey: string = 'language';
    cache: any = null;
    public languageChange: EventEmitter<Language> = new EventEmitter<Language>();
    private defaultLanguage: Language = new Language({ name: 'RUS', id: 2, icon: 'flag-russian.png' });
       
    constructor(
        private serverParamsService: ServerParamsTransfer,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _http: HttpClient,
        @Inject(PLATFORM_ID) private _platformId: Object
    ) { }

    public getLanguages() {
        if (!this.serverParamsService.serverParams.isBotRequest)
           // return this._http.get(environment.apiUrl + 'location/languages');
           return of({ data: [{id: 1, name: "UKR", icon: "flag-ukraine.png"}, {id: 2, name: "RUS", icon: "flag-russian.png"}] });

        return of({ data: [this.defaultLanguage] });
    }

    public getSelectedLanguage(): Language {
        let lng = this.defaultLanguage;

        if (isPlatformBrowser(this._platformId)) {
            let lngString = localStorage.getItem(this.languageKey);
            if (lngString)
                return JSON.parse(lngString)
            else {

                this.setSelectedLanguage(lng);
                return lng;
            }
        }
        
        return lng;
    }

    public setSelectedLanguage(lng: Language) {
        if (isPlatformBrowser(this._platformId)) {
            localStorage.setItem(this.languageKey, JSON.stringify(lng));
            this.languageChange.emit(lng);
        }
    }

    getLanguageChangeEmitter() {
        return this.languageChange;
    }
}