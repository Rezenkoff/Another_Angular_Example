import { Component, OnInit, OnDestroy, EventEmitter, Inject, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrderStepBaseComponent } from "./order-step-base.component";
import { UserCar } from "../../vehicle/models/user-car.model";
import { OrderStepService } from "../order-step.service";
import { LastInfoService } from "../last-info.service";
import { AlertService } from "../../services/alert.service";
import { LanguageService } from "../../services/language.service";
import { VinSearchService } from "../../services/vinsearch.service";
import { IAlertTranslations, ALERT_TRANSLATIONS } from "../../translate/custom/alert-translation";
import * as carValidator from '../../vehicle/models/car-validator-provider';
import { Store } from '@ngrx/store';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: 'find-by-vin-step',
    templateUrl: './__mobile__/find-by-vin-step.component.html'
})
export class FindByVinStepComponent implements OnInit, OnDestroy, OrderStepBaseComponent {

    isValid: boolean;
    change: EventEmitter<any> = new EventEmitter<any>();
    userVehicles: UserCar[] = [];
    destroy$: Subject<boolean> = new Subject<boolean>();
    @Output() moveNext: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private orderStepService: OrderStepService,   
        private _alertService: AlertService,
        private _languageService: LanguageService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _lastinfo: LastInfoService,
        private _vehicleStore: Store<fromVehicle.State>,
        private _vinSearchService: VinSearchService,
    ) { }

    ngOnInit() {
        this._vehicleStore.select(fromVehicle.getUserVehicles).pipe(takeUntil(this.destroy$)).subscribe(cars => {
            this.userVehicles = cars;
        });

        let queryParams = this._activatedRoute.snapshot.queryParams;
        let vin = queryParams['vin'];
        this.findCarByVin(vin);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    private findCarByVin(vin: string): void {
        let language = this._languageService.getSelectedLanguage().name;
        let message = this._translations.ERRORS[`vin_not_found_${language}`] || "По данному vin ничего не найдено";

        var saved = this._lastinfo.getLastRememberedVehicle();
        if (saved && this.orderStepService.OrderStepMainModel.Vehicle && this.orderStepService.OrderStepMainModel.Vehicle.vin == vin) {
            this.Validate();
            this.moveNext.emit(true);
            return;
        }

        this._vinSearchService.SearchByVin(vin)   
            .subscribe(findedVehicle => {            
                if (findedVehicle && carValidator.isValidUserCar(findedVehicle)) {
                    this.addVehicle(findedVehicle)
                } else {
                    this._alertService.warn(message);
                    this.moveNext.emit(false);
                }
            }, err => {
                this._alertService.warn(message);
                this.moveNext.emit(false);
            });
    }    

    public addVehicle(selectedCar: UserCar) {
        this.orderStepService.OrderStepMainModel.Vehicle = selectedCar;
        this._lastinfo.rememberLastVehicle();
        this.Validate();

        let carAlreadyExists: boolean = carValidator.isAlreadyAdded(selectedCar, this.userVehicles);

        if (!carAlreadyExists) {
            this._lastinfo.rememberLastVehicle();
            selectedCar.isActive = true;
            this._vehicleStore.dispatch(new vehicle.AddVehicleAction(selectedCar));
        }   

        if (this.isValid) {
            this.moveNext.emit(true);
        }
    }

    Validate(): void {
        this.isValid = carValidator.isValidUserCar(this.orderStepService.OrderStepMainModel.Vehicle);
        this.change.emit(this.isValid);
    }
}