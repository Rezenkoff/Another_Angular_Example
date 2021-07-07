import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserCar } from "../../vehicle/models/user-car.model";
import { OrderStepService } from "../order-step.service";
import { LastInfoService } from "../last-info.service";
import { AlertService } from "../../services/alert.service";
import { LanguageService } from "../../services/language.service";
import { VinSearchService } from "../../services/vinsearch.service";
import { IAlertTranslations, ALERT_TRANSLATIONS } from "../../translate/custom/alert-translation";
import * as carValidator from '../../vehicle/models/car-validator-provider';
import { Subject } from "rxjs";
import { SearchHelpCallbackComponent } from "../../shared/components/search-help-callback/search-help-callback.component";

@Component({
    selector: 'ref-vinsearch',
    templateUrl: './__mobile__/ref-vinsearch.component.html'
})
export class RefVinSearchComponent implements OnInit, OnDestroy {

    isValid: boolean;
    car: UserCar = null;
    destroy$: Subject<boolean> = new Subject<boolean>();
    public vin: string;
    @ViewChild("callback") callbackComponent: SearchHelpCallbackComponent;    
    public carFound: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private orderStepService: OrderStepService,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _lastinfo: LastInfoService,       
        private _vinSearchService: VinSearchService,
    ) { }

    ngOnInit() {
        let queryParams = this._activatedRoute.snapshot.queryParams;
        let referal = queryParams['user'];

        this.vin = queryParams['vin'];
        this.findCarByVin(this.vin);
        this.processReferalLink(referal);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    private findCarByVin(vin: string): void {
        let language = this._languageService.getSelectedLanguage().name;
        let message = this._translations.ERRORS[`vin_not_found_${language}`] || "По данному vin ничего не найдено";

        this._vinSearchService.SearchByVin(vin)
            .subscribe(findedVehicle => {
                if (findedVehicle && carValidator.isValidUserCar(findedVehicle)) {
                    this.addVehicle(findedVehicle);
                    this.carFound = true;
                } else {
                    this._alertService.warn(message);
                }
            }, err => {
                this._alertService.warn(message);                
            });
    }

    private processReferalLink(referal: string): void {
        this._lastinfo.setRefId(parseInt(referal) || null);        
    }

    public addVehicle(selectedCar: UserCar): void {
        this.car = selectedCar;
        this.orderStepService.OrderStepMainModel.Vehicle = selectedCar;
        this._lastinfo.rememberLastVehicle();
    }

    public moveToOrderStep(): void {
        this._router.navigate(['order-main'], { queryParams: { vin: this.vin } });
    }

    public toggleCallbackWindow() {
        this.callbackComponent.toggleWindow();
    }
}