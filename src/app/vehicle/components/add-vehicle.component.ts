import { Component, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { AlertService } from '../../services/alert.service';
import { LanguageService } from '../../services/language.service';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import { Subscription } from 'rxjs';
import { CarsPanelStateChange } from '../../car-select-panel/models/cars-panel-state-change.model';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
import * as carValidator from '../../vehicle/models/car-validator-provider';

@Component({
    selector: 'add-vehicle',
    templateUrl: './__mobile__/add-vehicle.component.html',
    styleUrls: ['./__mobile__/styles/add-vehicle.component__.scss']
})

export class AddVehicleComponent {

    newVehicle: UserCar = new UserCar();
    userVehicles: UserCar[] = [];
    subscription: Subscription;
    language: string;
    public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Zа-яА-Я0-9\]') } };

    constructor(private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialogRef: MatDialogRef<AddVehicleComponent>,
        private _alertService: AlertService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _languageService: LanguageService) {
        this.subscription = this._vehicleStore.select(fromVehicle.getUserVehicles).subscribe(vehicles => { this.userVehicles = vehicles; });        
    }

    ngOnInit() {
        this.language = this._languageService.getSelectedLanguage().name;
    }

    public close(): void {
        this.dialogRef.close();
    }

    public onVehicleCreated(createdVehicle: UserCar) {
        let message = this._translations.ERRORS[`vin_not_found_${this.language}`] || "По данному vin ничего не найдено";
        if (!createdVehicle) {
            this._alertService.warn(message);
            return;
        }

        this.newVehicle = createdVehicle;
        this.newVehicle.isActive = true;
    }

    public addVehicle() {
        this.newVehicle.isActive = true;
        let alreadyAdded: boolean = this.isAlreadyAdded();
        if (!alreadyAdded) {
            this._vehicleStore.dispatch(new vehicle.AddVehicleAction(this.newVehicle));
            this.dialogRef.close();
        }
        else {
            let message = this._translations.ERRORS[`vehicle_already_added_${this.language}`] || "Данный автомобиль уже добавлен !";
            this._alertService.warn(message);
        }
    }

    public onCarSelect() {        
        this.onVehicleCreated(this.newVehicle);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public CarIsValid(): boolean {        
        return carValidator.isValidUserCar(this.newVehicle);
    }

    onCarModelChange(changes: CarsPanelStateChange[]): void {        
        changes.forEach(c => {
            switch (c.filterType) {
                case CarFilterKeys.markKey:
                    this.newVehicle.markKVP = c.selectedOptions[0] || null;
                    this.newVehicle.mark = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                    break;
                case CarFilterKeys.serieKey:
                    this.newVehicle.serieKVP = c.selectedOptions[0] || null;
                    this.newVehicle.model = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                    break;
                case CarFilterKeys.yearKey:
                    this.newVehicle.yearKVP = c.selectedOptions[0] || null;
                    this.newVehicle.year = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                    break;
                case CarFilterKeys.modelKey:
                    this.newVehicle.modelKVP = c.selectedOptions[0] || null;
                    this.newVehicle.model = (c.selectedOptions[0]) ? c.selectedOptions[0].value : this.newVehicle.model;
                    break;
                case CarFilterKeys.modifKey:
                    this.newVehicle.modifKVP = c.selectedOptions[0] || null;
                    break;
                default:
                    return;
            }
        });        
    }

    public isAlreadyAdded(): boolean {
        return carValidator.isAlreadyAdded(this.newVehicle, this.userVehicles);
    }
}
