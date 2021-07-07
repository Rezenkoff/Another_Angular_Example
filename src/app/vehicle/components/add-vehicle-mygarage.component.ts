import { Component, Inject, Output } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
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
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'add-vehicle-mygarage',
    templateUrl: './__mobile__/add-vehicle-mygarage.component.html',
    styleUrls: ['./__mobile__/styles/add-vehicle-mygarage.component__.scss']
})

export class AddVehicleMyGarageComponent {

    newVehicle: UserCar = new UserCar();
    userVehicles: UserCar[] = [];
    subscription: Subscription;
    language: string;
    public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Zа-яА-Я0-9\]') } };
    public dateDays: string[] = [];
    public dateMonth: string[] = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    public dateMonthEnd: string[] = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    public dateYear: string[] = [];
    public showDay: boolean = false;
    public showMonth: boolean = false;
    public showYear: boolean = false;
    public day: string = '';
    public month: string = '';
    public year: string = '';


    public firstStep: boolean = false;
    @Output() onNeedAddCar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onAddUserCar: EventEmitter<UserCar> = new EventEmitter<UserCar>();

    constructor(private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        private _alertService: AlertService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _languageService: LanguageService) {
        this.subscription = this._vehicleStore.select(fromVehicle.getUserVehicles).subscribe(vehicles => { this.userVehicles = vehicles; });
    }

    ngOnInit() {
        var i = 0;
        do {
            i++;
            this.dateDays.push(i.toString())
        } while (this.dateDays.length < 31);

        let dy = new Date();
        for (let y = dy.getFullYear() - 50; y <= dy.getFullYear(); y++) {
            this.dateYear.push(y.toString());
        }
        this.language = this._languageService.getSelectedLanguage().name;
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
            this._vehicleStore.dispatch(new vehicle.ChangeIsActive(this.newVehicle));
            this.onAddUserCar.emit(this.newVehicle);
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
        return carValidator.isValidUserCar(this.newVehicle) && this.firstStep;
    }

    closeSecondStep() {
        this.firstStep = false;
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

    public nextStep(step: number) {
        if (step == 1) {
            this.firstStep = !this.firstStep;
        }
        else {
            if (this.newVehicle.milage > 10000000 || this.newVehicle.milage < 0) {
                this._alertService.warn("Некорректно введен пробег");
                return;
            }

            this.newVehicle.birthdayCar = new Date();
            if (this.day != '' && this.month != '' && this.year != '') {               
                this.newVehicle.birthdayCar.setFullYear(Number(this.year));
                this.newVehicle.birthdayCar.setMonth(this.dateMonth.indexOf(this.month));
                this.newVehicle.birthdayCar.setDate(Number(this.day));
            }

            this.addVehicle();
            this.closeAddCar();
        }
    }

    public closeAddCar() {
        this.onNeedAddCar.emit(false);
    }
    public GetDateDays(_dateDays: Array<string>): Array<string> {
        if (this.day != '') {
            return _dateDays.filter(value => value.includes(this.day));
        }
        return _dateDays;
    }
    public GetDateMonth(_dateMonth: Array<string>): Array<string> {
        if (this.month != '') {
            return _dateMonth.filter(value => value.includes(this.month.toUpperCase()));
        }
        return _dateMonth;
    }

    public GetDateYears(_dateYear: Array<string>): Array<string> {
        if (this.year != '') {
            return _dateYear.filter(value => value.includes(this.year));
        }
        return _dateYear;
    }

    public toggleShowDay() {
        this.showDay = !this.showDay;
        this.showMonth = false;
        this.showYear = false;
        this.day = '';
    }
    public toggleShowMonth() {
        this.showDay = false;
        this.showMonth = !this.showMonth;
        this.showYear = false;
        this.month = '';
    }
    public toggleShowYear() {
        this.showDay = false;
        this.showMonth = false;
        this.showYear = !this.showYear;
        this.year = '';
    }

    public selectedDay(day: string) {
        this.day = day;
        this.showDay = !this.showDay;
    }

    public selectedMonth(month: string) {
        this.month = month;
        this.showMonth = !this.showMonth;
    }

    public selectedYear(year: string) {
        this.year = year;
        this.showYear = !this.showYear;
    }
}
