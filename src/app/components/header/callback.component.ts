import { Component, Inject, ViewChild, Input } from '@angular/core';
import { Router } from "@angular/router";
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { BitrixService } from '../../services/bitrix.service';
import { UserStorageService } from '../../services/user-storage.service';
import { AlertService } from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthHttpService } from '../../auth/auth-http.service';
import { Callback } from '../../models/callback.model';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UidParams } from '../../services/uid-params.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'auto-doc-callback',    
    templateUrl: './__mobile__/callback.component.html'
})
export class CallbackComponent extends BaseBlockComponent 
{
    callback: Callback = new Callback('', '');
    inProcess: boolean = false;
    @ViewChild('phone') phoneEl;
    @Input() isPopup: boolean = false;
    public destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _bitrixService: BitrixService,
        private _authService: AuthHttpService,
        private _userStorageService: UserStorageService,
        private _route: Router,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        private _http: HttpClient,
        private _uidParams: UidParams
    ) {
        super(_constants);
    }

    public ngOnInit() {
        this.verifyUserAuthorization();

        this._authService.userLogedIn
            .pipe(takeUntil(this.destroy$))
            .subscribe(logIn => {
                this.verifyUserAuthorization();
            })
    }

    createCallback() {
        let message: string;
        let language = this._languageService.getSelectedLanguage().name;

        if (!this.callback.userPhoneNumber || this.phoneEl.invalid) {
            message = this._translations.SUCCESS[`phone_field_empty_${language}`] || "Введите номер телефона";
            this._alertService.error(message);
            return;
        }

        this.callback.currentUrl = this._route.url;
        this.inProcess = true;

        if (!this._authService.isAuthenticated()) {

            this.CreateCallbackIfUserIsNotAutentificated(message, language);
        }

        if (this._authService.isAuthenticated()) {

            this.CreateCallbackIfUserIsAutentificated(message, language);
        }
    }

    public CreateCallbackIfUserIsNotAutentificated(message: string, language: string) {

        const params = new HttpParams().set('userPhone', this.callback.userPhoneNumber);

      this._http.get(environment.apiUrl + "crm/uid/getuid", { params: params, responseType: "text" }).subscribe((uidResult: any) => {

            let uid = uidResult._body;
            this._uidParams.setCurrentUnauthorizeUid(uid);
            this._userStorageService.checkUidParam();

            this.sendConfirmCallbackInfo(message, language);
        });
    }

    public CreateCallbackIfUserIsAutentificated(message: string, language: string) {

        this.sendConfirmCallbackInfo(message, language);
    }

    public sendConfirmCallbackInfo(message: string, language: string) {

        this._bitrixService.createCallbackLead(this.callback)
            .subscribe((data:any) => {
                this.inProcess = false;
                if (data.success) {

                    message = this._translations.SUCCESS[`success_callback_${language}`] || "Спасибо, ожидайте звонка менеджера";
                    this._alertService.success(message);
                }
                else
                    this._alertService.error(data.reason);//need translation
            }, error => {
                message = this._translations.ERRORS[`unknown_error_${language}`] || "Произошла ошибка. Попробуйте позже!";
                this._alertService.error(message);
            });
    }

    verifyUserAuthorization() {
        if (this._authService.isAuthenticated()) {
            let user = this._userStorageService.getUser();
            this.callback.userPhoneNumber = user.phone.replace('+38', '');
        } else {
            this.callback.userPhoneNumber = '';
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
