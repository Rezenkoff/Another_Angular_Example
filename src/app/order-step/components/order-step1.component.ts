﻿import { Component, Inject, EventEmitter, Output, HostListener, OnInit, OnDestroy } from '@angular/core';
import { OrderStepBaseComponent } from './order-step-base.component';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { OrderStepService } from '../order-step.service';
import { LastInfoService } from '../last-info.service';
import { AlertService } from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';
import { AuthHttpService } from '../../auth/auth-http.service';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { KeyValueModel } from '../../models/key-value.model';
import { UserCar } from '../../vehicle/models/user-car.model';
import { MatDialog } from '@angular/material/dialog';
import { ShortVehicleListComponent } from '../../vehicle/components/short-vehicle-list.component';
import { SelectByParamsModalComponent } from './select-by-params-modal.component';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import * as carValidator from '../../vehicle/models/car-validator-provider';
import { Store } from '@ngrx/store';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserStorageService } from 'src/app/services/user-storage.service';

@Component({
    templateUrl: './__mobile__/order-step1.component.html'
})

export class OrderStepComponent1 extends BaseLoader implements OnInit, OnDestroy, OrderStepBaseComponent {
    public isSearchBySelectedCar: boolean = false;
    public vinModel: any;
    public notFound: boolean = false;
    public isValid: boolean;
    public marksList: Array<KeyValueModel> = null;
    public selectedVehicle: KeyValueModel = new KeyValueModel(0, 'Выберите марку');
    public hideButtons: boolean = false;
    public unauthorized: boolean = false;
    public noVehicle = false;
    public selectedUserCar: UserCar;

    userVehicles: UserCar[] = [];
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        public orderStepService: OrderStepService,
        private _authService: AuthHttpService,
        private _lastinfo: LastInfoService,
        public dialog: MatDialog,
        public _alertService: AlertService,
        public _languageService: LanguageService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _userStorage: UserStorageService,
        private _vehicleStore: Store<fromVehicle.State>
    ) {
        super();
    }

    ngOnInit() {
        this._vehicleStore.select(fromVehicle.getUserVehicles).pipe(takeUntil(this.destroy$)).subscribe(cars => {
            this.userVehicles = cars;
        });

        this.selectedUserCar = this._userStorage.getData("garage-key2step");

        if (this.selectedUserCar != null) {
            this.addVehicle(this.selectedUserCar);
            this._userStorage.removeData("garage-key2step");
        }

        setTimeout(() => {
            let loaded = this._lastinfo.getLastRememberedVehicle();
            if (loaded)
                this.hideButtons = true;

            this.Validate();
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    //TO DO move to directive
    @HostListener('window:keyup', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent>event;
        if (e.keyCode == 27) {
            this.Close();
        }
    }

    Validate(): void {

        if (this.orderStepService.OrderStepMainModel.Vehicle.model == 'No') {
            this.noVehicle = true;
        }
        this.isValid = carValidator.isValidUserCar(this.orderStepService.OrderStepMainModel.Vehicle);
        this.change.emit(this.isValid);
    }

    public getLogo(brand: string): string {
        if (!brand)
            return;

        return this._constants.IMAGES.VIN_MODEL + brand.toUpperCase() + '.PNG'
    }

    public resetSelectedVehicle() {

        this.orderStepService.OrderStepMainModel.Vehicle = new UserCar();
        this._lastinfo.rememberLastVehicle();
        this.hideButtons = false;
        this.Validate();
    }

    resetMessages(): void {
        this.notFound = false;
        this.unauthorized = false;
    }

    resetVinInput(): void {
        this.vinModel = "";
    }

    public toggleSearchByVehicleParamsBox(): void {
        let dialogRef = this.dialog.open(SelectByParamsModalComponent, {});
        dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.addVehicle(result);
        });
    }

    public searchBySelectedCar(): void {

        if (this._authService.isAuthenticated()) {
            this.isSearchBySelectedCar = true;
            let dialogRef = this.dialog.open(ShortVehicleListComponent, {});
            dialogRef.afterClosed().subscribe(result => {
                if (result)
                    this.addVehicle(result);
            });
        }
        else {
            this.unauthorized = true;
        }
    }

    public displayUnauthorizeMessage(): void {
        this.unauthorized = false;
    }

    public setSelectedVehicle(userVehicle: UserCar) {

        this.orderStepService.OrderStepMainModel.Vehicle = userVehicle;
        this.hideButtons = true;
        this.resetVinInput();
        this.resetMessages();
        this.Validate();
        this.isSearchBySelectedCar = !this.isSearchBySelectedCar;
    }

    public addVehicle(selectedCar: UserCar) {

        let language = this._languageService.getSelectedLanguage().name;
        let message = this._translations.ERRORS[`vin_not_found_${language}`] || "По данному vin ничего не найдено";

        let carAlreadyExists: boolean = carValidator.isAlreadyAdded(selectedCar, this.userVehicles);

        if (selectedCar && carValidator.isValidUserCar(selectedCar)) {
            var vin = this.orderStepService.OrderStepMainModel.Vehicle.vin ? this.orderStepService.OrderStepMainModel.Vehicle.vin : null;
            this.orderStepService.OrderStepMainModel.Vehicle = selectedCar;
            if (vin) {
                this.orderStepService.OrderStepMainModel.Vehicle.vin = vin;
            }
            this.hideButtons = true;
            this.resetVinInput();
            this.resetMessages();
            this.Validate();

            if (!carAlreadyExists) {
                //this._lastinfo.rememberLastVehicle();
                selectedCar.isActive = true;
                this._vehicleStore.dispatch(new vehicle.AddVehicleAction(selectedCar));
            }

        }
        else
            this._alertService.warn(message);
    }

    public Close() {
        this.isSearchBySelectedCar = false;
    }

    public getDisableMyVehicles(): string {
        return this._authService.isAuthenticated() ? '' : 'disabled-button';
    }
}
