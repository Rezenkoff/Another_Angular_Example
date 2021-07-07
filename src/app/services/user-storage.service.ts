import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CurrentUser } from '../auth/models/current-user.model';
import { isPlatformBrowser } from '@angular/common';
import { UserPreferencesModel } from '../auth/models/user-preferences.model';
import { CookieService } from 'ngx-cookie-service';
import { GtagService } from './gtag.service';
import { UidParams } from './uid-params.service';

const userKey: string = "user";
const defaultUserKey: string = "SimpleUser";

@Injectable()
export class UserStorageService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _cookieService: CookieService,
        private _gtagService: GtagService,
        private _uidParams: UidParams
    ) { }

    public setUser(user: CurrentUser) {
        if (!isPlatformBrowser(this.platformId) || !user) {
            return;
        }
        this.upsertData(userKey, user);
    }

    getUserUid(): string {
        let currentUid = '';
        let currentUser = this.getUser();
        
        if (currentUser && currentUser.token && currentUser.uid) {

            currentUid = currentUser.uid;
            return currentUid;
        }

        return currentUid;
    }

    public getData(key: string): any {
        if (isPlatformBrowser(this.platformId)) {
            var item = localStorage.getItem(key);
        }

        return item ? JSON.parse(item) : null;
    }

    public upsertData(key: string, value: any): void {
        if (!value || !key)
            return;

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    public removeData(key: string): void {
        if (!key)
            return;

        localStorage.removeItem(key);
    }

    public setToken(token: string, expiresInSecond: string) {
        if (isPlatformBrowser(this.platformId)) {
            let user = new CurrentUser("", "", "", token, "", "", false, "", new UserPreferencesModel());

            this.setUser(user);

            let date = Date.now();
            let expMiliseconds = expiresInSecond + "000";
            date += +expMiliseconds;

            return date.toString();
        }
    }

    public getUser(): CurrentUser 
    {
        let user = new CurrentUser(null, null, null, null, null, null, false, "", new UserPreferencesModel());

        if (!isPlatformBrowser(this.platformId)) {
            return user;
        }

        let jsonUser: string = localStorage.getItem(userKey);
        try {
            let stored: CurrentUser = JSON.parse(jsonUser);
            return { ...user, ...stored };
        } catch {
            return user
        }
    }

    public getUserNumber() {
        if (isPlatformBrowser(this.platformId)) {
            let jsonUser = localStorage.getItem(userKey);
            let user = JSON.parse(jsonUser);
            if (user == null)
                return null;
            return user.phone;
        }

        else
            return defaultUserKey;
    }

    public getUserRole(): string {
        if (isPlatformBrowser(this.platformId)) {
            let jsonUser = localStorage.getItem(userKey);
            let user = JSON.parse(jsonUser);
            if (user == null)
                 return null;
            return user.role;
        }
        else
            return defaultUserKey;
    }

    public getUserToken(): string {
        if (isPlatformBrowser(this.platformId)) {
            let jsonUser = localStorage.getItem(userKey);
            let user = JSON.parse(jsonUser);

            if (user == null) {

                return null;
            }

            this.checkUidParam();

            return user.token;
        }
        else
            return defaultUserKey;
    }

    public checkUidParam() {
        
        let user = this.getUser();

        if (user && user.token === null && user.uid) {
            this.clearToken()
        }

        if (this._uidParams.getCurrentUid() && user.token) {
            return;
        }

        if (user && user.token && !user.uid) { //пользователи которые залогинены до введения логики uid идентификатора
    
            this.clearToken();
        }

        if (user && user.uid) {

            let uidResult = this._gtagService.setUserUid(user.uid);
            if (uidResult) {
                this._uidParams.setCurrentUid(user.uid);
            }
        }

       if (!user.token && !user.uid && this._uidParams.getCurrentUnauthorizeUid() && !this._uidParams.uidIsSavedInGtag) {

            this._uidParams.uidIsSavedInGtag =  this._gtagService.setUserUid(this._uidParams.getCurrentUnauthorizeUid());
        }
    }

    public deleteUserIdParam() {

       let currentUserUid = this._uidParams.getCurrentUid();
        if (currentUserUid) {
            this._uidParams.setCurrentUid('');
        }
    }
    public removeUser(): void {
        if (isPlatformBrowser(this.platformId))
            this.removeData(userKey);
    }

    public clearToken(): void {
        if (isPlatformBrowser(this.platformId)) {
            let user = this.getUser();
            user.token = null;
            user.uid = '';
            this._uidParams.clearCurrentUid();
            this.setUser(user);
        }
    }

    public getRefId(): number {
        if (isPlatformBrowser(this.platformId)) {
           var str = localStorage.getItem('refId');
           return (str) ? parseInt(str) : null;
        }
        return null;
    }

    public setRefId(refId: number): void {
        let strRef = (refId) ? refId.toString() : null;
        localStorage.setItem('refId', strRef);
    }

    public getClientId(): string {
        var _ga = this._cookieService.get('_ga');
        var clientId = _ga.substring(6);
        return clientId;
    }
    public setDealId(dealId: number): void {
        let strRef = (dealId) ? dealId.toString() : null;
        localStorage.setItem('dealId', strRef);
    }
    public getDealId(): number {
        if (isPlatformBrowser(this.platformId)) {
           var str = localStorage.getItem('dealId');
           return (str) ? parseInt(str) : null;
        }
        return null;
    }
    public deleteDealId(): void {
        localStorage.removeItem('dealId');
    }
}