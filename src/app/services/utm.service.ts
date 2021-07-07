import { Injectable } from '@angular/core';
import { UtmModel } from '../models/utm.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserStorageService } from './user-storage.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieModel } from '../models/cookie.model';

@Injectable()
export class UtmService {
    private utmFieldsKey: string = 'utmFields';
    private utmFields: UtmModel;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _route: Router,
        private _userStorage: UserStorageService,
        private _cookieService: CookieService
    ) {
        this._route.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.SetUtmFieldsToLocalStorage();
            }
        });
    }

    private GetUTMParamsFromQuery() : UtmModel {
        let params = this._activatedRoute.snapshot.queryParams;
        if (params["utm_source"] && params["utm_medium"] && params["utm_campaign"]) {
            this.utmFields = new UtmModel(params["utm_source"], params["utm_medium"], params["utm_campaign"], params["utm_term"] || '', params["utm_content"] || '');
        }

        return this.utmFields;
    }

    private SetUtmFieldsToLocalStorage() {
        let utmModel = this.GetUTMParamsFromQuery();
        if (utmModel) {
            this._userStorage.upsertData(this.utmFieldsKey, utmModel);
        }
    }

    public GetUtmFieldsFromLocalStorage() {
        if (this.utmFields)
            return this.utmFields;

        this.utmFields = this._userStorage.getData(this.utmFieldsKey);

        if (this.utmFields == null) {
            let cookie = this._cookieService.get('rngst2');
            let cookieAsObj = this.checkCookie(cookie);

            if (cookieAsObj == null || cookieAsObj.utmz == null) {
                cookieAsObj = new CookieModel();
                cookieAsObj.cookie_error = window.navigator.userAgent;

                return new UtmModel('', '', '', '', '', cookieAsObj.cookie_error);
            }

            return new UtmModel(cookieAsObj.utmz.utm_source, cookieAsObj.utmz.utm_medium, cookieAsObj.utmz.utm_campaign, '', cookieAsObj.utmz.utm_content);
        } 

        return this.utmFields;
    }

    private checkCookie(cookie: string): CookieModel {

        if (cookie) {

            let cookieResult = JSON.parse(cookie) as CookieModel;
            return cookieResult;
        }
        return null;
    }
}
