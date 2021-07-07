import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import { ChangePassword, UserData, UpdateEmail, InitialUserData } from './models';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProfileService {

    constructor(private _http: HttpClient) { }

    changePassword(model: ChangePassword) {
        //need auth
        return this._http.post(environment.apiUrl + 'account/password/change', JSON.stringify(model)).pipe(           
            catchError((error: any) => throwError(error)))
    }

    changeUserData(model: UserData) {
        //auth
        return this._http.post(environment.apiUrl + 'account/changedata', JSON.stringify(model)).pipe(
            catchError((error: any) => throwError(error)))
    }

    getUserData() {
        //auth
        return this._http.get<InitialUserData>(environment.apiUrl + 'cabinet/userdata').pipe(
            catchError((error: any) => throwError(error)))
    }

    updateEmailByPhone(model: UpdateEmail) {
        //auth
        return this._http.put(environment.apiUrl + 'account/update/email', JSON.stringify(model)).pipe(
            catchError((error: any) => throwError(error)))
    }
}