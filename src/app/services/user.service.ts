import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { UserStorageService } from './user-storage.service';
import { CurrentUser } from '../auth/models';
import { UserPreferencesModel } from '../auth/models/user-preferences.model';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthHttpService } from '../auth/auth-http.service';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { NavigationService } from './navigation.service';
import { MainUserInfoModel } from '../order-user-info/models/main-user-info.model';
import { Area } from '../location/area/area.model';
import { environment } from '../../environments/environment';
import { ServerParamsTransfer } from '../server-params-transfer.service';

@Injectable()
export class UserService extends AuthHttpService {

    private timeoutId: any;

    constructor(
        @Inject(APP_CONSTANTS) private _appConstants: IAppConstants,        
        private _userStorageService: UserStorageService,
        _http: HttpClient,
        private __navigationService: NavigationService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public serverParamsService: ServerParamsTransfer
    ) {
        super(_appConstants, _userStorageService, _http, __navigationService, serverParamsService)
    }

    public updateUserPaymentType(paymentTypeId: number): void {
        let user = this._userStorageService.getUser();
        user.userPreferences.paymentMethodId = paymentTypeId;        
        this.saveChanges(user);
    }

    public updateUserDeliveryType(deliveryTypeKey: number): void {
        let user = this._userStorageService.getUser();
        user.userPreferences.deliveryMethodKey = deliveryTypeKey;       
        this.saveChanges(user);
    }

    public updateUserArea(area: Area): void {
        let user = this._userStorageService.getUser();
        user.userPreferences.areaId = area.areaId;
        user.userPreferences.areaNameRus = area.areaNameRus != null && area.areaNameRus != '' ? area.areaNameRus : '';
        user.userPreferences.areaNameUkr = area.areaNameUkr != null && area.areaNameUkr != '' ? area.areaNameUkr : '';
        this.saveChanges(user);
    }

    public updateUserDeliveryPoint(pointKey: string): void {
        let user = this._userStorageService.getUser();
        user.userPreferences.deliveryPointKey = pointKey;    
        this.saveChanges(user);
    }

    public updateUserCity(cityKey: string): void {
        let user = this._userStorageService.getUser();
        user.userPreferences.settlementKey = cityKey;
        this.saveChanges(user);
    }
    
    public updateUserAddress(address: string): void {
        if (!address) {
            return;
        }
        let user = this._userStorageService.getUser();
        user.userPreferences.userAddress = address;
        this.saveChanges(user);
    }

    public updateAgreementStatus(agreed: boolean): void {
        let user = this._userStorageService.getUser();
        user.isOfferAgreed = agreed;
        this.saveChanges(user);
    }

    public updateUserInfo(data: MainUserInfoModel): void {
        let user = this._userStorageService.getUser();
        user.name = data.name;
        user.phone = data.phone;
        user.email = data.email;
        this.saveChanges(user);
    }

    private saveChanges(user: CurrentUser): void  {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this._userStorageService.setUser(user);
        if (this.isAuthenticated()) {
            this.updateUserPreferences(user.userPreferences);
        }        
    }

    private updateUserPreferences(preferences: UserPreferencesModel): void {     
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this._http.post(environment.apiUrl + 'account/update-preferences', JSON.stringify(preferences)).subscribe(),
            3000);        
    }

    public getCurrentUserRole(): string {
        return this._userStorageService.getUserRole();
    }
}
