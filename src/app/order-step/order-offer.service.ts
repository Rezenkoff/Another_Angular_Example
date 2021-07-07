import { Injectable } from '@angular/core';
import { UserStorageService } from '../services/user-storage.service';

@Injectable()
export class OrderOfferService {

    private storageKey = 'isOfferAgreed';

    constructor(private _userStorage: UserStorageService) { }

    public getAgreementStatusFromStorage(): boolean {
        let user = this._userStorage.getUser();
        if (user) {
            return user.isOfferAgreed;
        }
        else {
            return this.getSavedAggrement();
        }
    }

    public setAgreementStatus(agree: boolean): void {       
        let user = this._userStorage.getUser();
        if (user) {
            user.isOfferAgreed = agree;
            this._userStorage.setUser(user);
        }
    }

    private getSavedAggrement(): boolean {
        return <boolean>this._userStorage.getData(this.storageKey);
    }

    public swapAgreementWithRegistredUser(): void {
        let user = this._userStorage.getUser();
        let agreement = this.getSavedAggrement();

        if (agreement == null)
            return;

        user.isOfferAgreed = this.getSavedAggrement();

        this._userStorage.removeData(this.storageKey);
        this._userStorage.setUser(user);
    }
}