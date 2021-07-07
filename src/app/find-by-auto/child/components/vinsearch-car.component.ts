import { Component, OnInit, Input, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { LaximoService } from '../../../services/laximo.service';
import { LastInfoService } from '../../../order-step/last-info.service';
import { CatalogCar } from '../models/catalog-car.model';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { IAppConstants, APP_CONSTANTS } from '../../../config/app-constants';
import { CallbackVin } from '../models/callback-vin';
import { BitrixService } from '../../../services/bitrix.service';
import { IAlertTranslations, ALERT_TRANSLATIONS } from '../../../translate/custom/alert-translation';
import { AlertService } from '../../../services/alert.service';
import { LanguageService } from '../../../services/language.service';
import { Subject } from 'rxjs';
import { AuthHttpService } from '../../../auth/auth-http.service';
import { UserStorageService } from '../../../services/user-storage.service';

@Component({
    selector: 'vinsearch-car',
    templateUrl: './__mobile__/vinsearch-car.component.html'
})

export class VinSearchCarComponent extends BaseLoader implements OnInit, OnDestroy {
    @Input() vin: string;
    @Output() backButtonPress: EventEmitter<any> = new EventEmitter<any>();
    vinSearchCarList: CatalogCar[] = [];
    callbackVin: CallbackVin = new CallbackVin();
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _router: Router,
        private _laximoService: LaximoService,
        private _bitrixService: BitrixService,
        private _lastInfoService: LastInfoService,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        private _authService: AuthHttpService,
        private _userStorageService: UserStorageService,
    ) {
        super();
    }

    ngOnInit() {
        this.findCar();
        this.verifyUserAuthorization();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    goBack() {
        this.backButtonPress.emit(true);
    }

    findCar() {
        //this.StartSpinning();
        //this._laximoService.SearchByVin(this.vin).pipe(
        //    finalize(() => this.EndSpinning()))
        //    .subscribe(
        //        response => {
        //            if (response.Vechicle['row'] && response.Vechicle['row'][0]) {
        //                if (response.Vechicle['row'].length == 1) {
        //                    this.routeToGroups(response.Vechicle['row'][0]);
        //                }
        //                this.vinSearchCarList = response.Vechicle['row'] as CatalogCar[];
        //                for (let car of this.vinSearchCarList) {
        //                    this.setAttributes(car);
        //                }
        //            }
        //        })
    }

    setAttributes(vinSearchCar: CatalogCar) {
        vinSearchCar.attributes = {};
        for (let key of ['date', 'market', 'transmission', 'engine', 'manufactured', 'drive']) {
            let tmp = vinSearchCar.attribute.find(attr => attr.key === key);
            vinSearchCar.attributes[key] = tmp ? tmp.value : '-';
        }
    }

    routeToGroups(vinSearchCar: CatalogCar) {
        this._laximoService.SaveCarBySsd(vinSearchCar.ssd, vinSearchCar);
        this._lastInfoService.rememberVinSearchVehicle(vinSearchCar);
        this._router.navigate(['detail-groups', { ssd: vinSearchCar.ssd, code: vinSearchCar.catalog, vehicleId: vinSearchCar.vehicleId, brand: vinSearchCar.brand, vinCode: this.vin }]);
    }

    public createCallback() {
        this.StartSpinning();
        let language = this._languageService.getSelectedLanguage().name;
        let message;
        this.callbackVin.currentUrl = this._router.url;
        this.callbackVin.vin = this.vin;
        this.callbackVin.vinFound = false;

        this._bitrixService.createVinSearchCallback(this.callbackVin).pipe(
            finalize(() => this.EndSpinning()),
            takeUntil(this.ngUnsubscribe))
            .subscribe((resp:any) => {
                if (resp.success) {
                    message = this._translations.SUCCESS[`success_callback_${language}`];
                    this._alertService.success(message);
                }
                else {
                    this._alertService.error('Извините, проблемы на сервере.');
                }
            })
    }

    verifyUserAuthorization() {
        if (this._authService.isAuthenticated()) {
            let user = this._userStorageService.getUser();
            this.callbackVin.userPhoneNumber = user.phone.replace('+38', '');
        } else {
            this.callbackVin.userPhoneNumber = '';
        }
    }
}
