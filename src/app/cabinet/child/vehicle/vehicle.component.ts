import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { APP_CONSTANTS, IAppConstants } from '../../../config/app-constants';
import { SortService } from '../../../services/sort.service';
import { AlertService } from '../../../services/alert.service';
import { NavigationService } from '../../../services/navigation.service';
import { UserStorageService } from '../../../services/user-storage.service';
import { AddVehicleComponent } from '../../../vehicle/components/add-vehicle.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../../vehicle/models/user-car.model';
import { CarFilterKeys } from '../../../filters/models/car-filter-keys';
import * as fromVehicle from '../../../vehicle/reducers';
import * as vehicle from '../../../vehicle/actions/vehicle.actions';

@Component({
    selector: 'vehicle',
    templateUrl: './__mobile__/vehicle.component.html',
    styleUrls: ['./__mobile__/styles/vehicle.component__.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VehicleComponent extends BaseLoader {
    vehicles: UserCar[];
    vehicle: UserCar;
    editVehicle: UserCar;
    position: number;
    sameVinCode: boolean;
    showDisabled: boolean = false;

    public needAddCar: boolean = false;
    public selectedUserCar: UserCar;
    public isNeedEdit: boolean = false;
    public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Zа-яА-Я0-9\]') } };
    public dateDays: string[] = [];
    public dateMonth: string[] = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    public dateYear: string[] = [];
    public showDay: boolean = false;
    public showMonth: boolean = false;
    public showYear: boolean = false;
    public day: string = '';
    public month: string = '';
    public year: string = '';

    public userVehiclesList: UserCar[];

    constructor(@Inject(APP_CONSTANTS) protected constants: IAppConstants,
    private _sortService: SortService,
    private _vehicleStore: Store<fromVehicle.State>,
    private _alertService: AlertService,
    private _navigationService: NavigationService,
    private _userStorage: UserStorageService,
    public dialog: MatDialog) {
        super();
        this.vehicles = [];
        this.vehicle = new UserCar();
        this.position = -1;
    }

    returnToCabinetInfo() {
      
        this._navigationService.NavigateToMobileInfo();
    }

    ngOnInit() {
        this._userStorage.removeData("garage-key2step");
        var i = 0;
        do {
            i++;
            this.dateDays.push(i.toString())
        } while (this.dateDays.length < 31);

        let dy = new Date();
        for (let y = dy.getFullYear() - 50; y <= dy.getFullYear(); y++) {
            this.dateYear.push(y.toString());
        }

        //this.userVehiclesList$ = this._vehicleStore.select(fromVehicle.getActiveUserVehicles);

        this._vehicleStore.select(fromVehicle.getActiveUserVehicles).subscribe(data => {
            this.userVehiclesList = data;
            if (this.selectedUserCar == null) {
                this.selectedUserCar = data[0];
            }
        });   

        this.textData();
    }

    private textData(): void {
        if (this.selectedUserCar == undefined || this.selectedUserCar.birthdayCar == undefined) {
            return;
        }

        let date = new Date(this.selectedUserCar.birthdayCar);

        this.month = this.dateMonth[date.getMonth()];
        this.year = date.getFullYear().toString();
        this.day = date.getDate().toString();
    }

    onAddVehicle(vehicle: UserCar) {
        this.vehicles.push(vehicle);
    }

    toggleAddBox() {
        this.dialog.open(AddVehicleComponent, {});
    }

    onCheckSameVin(vin) {
        let sameVehicle = this.vehicles.find(x => x.vin == vin);
        sameVehicle && vin != '' ? this.sameVinCode = true : this.sameVinCode = false;
    }

    onChangeVehicle(vehicle: UserCar) {
        this.vehicles.splice(this.position, 1, vehicle);
    }

    onSelectedUserCar(userCar: UserCar) {
        this.selectedUserCar = userCar;
        this.isNeedEdit = false;
        this.activBtnVehicleBirthday = false;
        this.activBtnVehicleMilage = false;
        this.activBtnVehicleName = false;
        this.activBtnVehicleVin = false;

        this.textData();
    }

    public addCar() {
        this.needAddCar = !this.needAddCar;
    }

    public getLink(item: number): string {
        switch (item) {
            case 1:
                let param = `${this.selectedUserCar.markKVP.key}--2000/${this.selectedUserCar.serieKVP.key}--2001`;
                return '/cars-catalog/' + param;  
            case 2:
                return "/category";
            case 3:
                return "/order-main/order-step";
        }
    }

    changeActive() {
        this._vehicleStore.dispatch(new vehicle.ChangeIsActive(this.selectedUserCar));
        let index = this.userVehiclesList.indexOf(this.selectedUserCar);
        this.userVehiclesList.splice(index, 1);

        this.selectedUserCar = this.userVehiclesList[0];
    }

    public needEditVehicle() {
        this.isNeedEdit = !this.isNeedEdit;
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
        this.day = '';
        this.showDay = !this.showDay;
        this.showMonth = false;
        this.showYear = false;
    }
    public toggleShowMonth() {
        this.month = '';
        this.showDay = false;
        this.showMonth = !this.showMonth;
        this.showYear = false;
    }
    public toggleShowYear() {
        this.year = '';
        this.showDay = false;
        this.showMonth = false;
        this.showYear = !this.showYear;
    }

    public selectedDay(day: string) {
        this.day = day;
        this.showDay = !this.showDay;
        this.validDate();
    }

    public selectedMonth(month: string) {
        this.month = month;
        this.showMonth = !this.showMonth;
        this.validDate();
    }

    public selectedYear(year: string) {
        this.year = year;
        this.showYear = !this.showYear;
        this.validDate();
    }

    private validDate(): void {
        if (this.dateDays.includes(this.day) && this.dateMonth.includes(this.month) && this.dateYear.includes(this.year)) {
            this.activBtnVehicleBirthday = true;
        }
        else {
            this.activBtnVehicleBirthday = false;
        }
    }

    public saveBirthday() {
        if (this.dateDays.includes(this.day) && this.dateMonth.includes(this.month) && this.dateYear.includes(this.year)) {

            this.selectedUserCar.birthdayCar = new Date();
            this.selectedUserCar.birthdayCar.setFullYear(Number(this.year));
            this.selectedUserCar.birthdayCar.setMonth(this.dateMonth.indexOf(this.month));
            this.selectedUserCar.birthdayCar.setDate(Number(this.day));


            this._vehicleStore.dispatch(new vehicle.EditVehicleAction(this.selectedUserCar));
            this.activBtnVehicleBirthday = false;
            this._alertService.success("Дата сохранена");
        }
        else {
            this._alertService.warn("Заполните все поля пожалуйста");
        }
    }

    public saveSelectedCar(item: number) {
        if (!this.canSave(item)) {
            return;
        }

        switch (item) {
            case 1:
                if (this.selectedUserCar.vin == null || this.selectedUserCar.vin == '' || this.selectedUserCar.vin.length < 15) {
                    this._alertService.warn("VIN поле заполнено не корректно");
                    return;
                }
                else {
                    this.activBtnVehicleVin = false;
                    this._alertService.success("VIN поле сохраненo");
                }
                break;
            case 2:
                if (this.selectedUserCar.ownNameCar == null || this.selectedUserCar.ownNameCar == '') {
                    this._alertService.warn("Имя не заполнено");
                    return;
                }
                else {
                    this.activBtnVehicleName = false;
                    this._alertService.success("Имя сохранено");
                }
                break;
            case 3:
                if (this.selectedUserCar.milage == null || this.selectedUserCar.milage == 0) {
                    this._alertService.warn("Пробег не заполнено");
                    return;
                }
                else {
                    this.activBtnVehicleMilage = false;
                    this._alertService.success("Пробег сохранен");
                }
                break;
        }
        this._vehicleStore.dispatch(new vehicle.EditVehicleAction(this.selectedUserCar));
    }

    public getBirthdaySelectedCar(): string {
        let birthday = new Date(this.selectedUserCar.birthdayCar);

        if (birthday.getFullYear() < 1970) {
            return '';
        }
        else {
            
            return ` ${birthday.getDate()}.${(birthday.getMonth() + 1 < 10 ? '0' + (birthday.getMonth() + 1).toString() : birthday.getMonth() + 1)}.${birthday.getFullYear()}`;
        }
    }

    public navigate(vehicle: UserCar): void {

        let params: Object = {};
        //if (vehicle.vin) {
        //    this._navigationService.NavigateToFindByAuto(vehicle.vin);
        //    return;
        //}
        if (vehicle.markKVP) {
            params[CarFilterKeys.markKey] = vehicle.markKVP.key;
        }
        if (vehicle.serieKVP) {
            params[CarFilterKeys.serieKey] = vehicle.serieKVP.key;
        }
        if (vehicle.modelKVP) {
            params[CarFilterKeys.modelKey] = vehicle.modelKVP.key;
        }
        if (vehicle.yearKVP && vehicle.yearKVP.value.length == 4) {
            params[CarFilterKeys.yearKey] = vehicle.yearKVP.key;
        }
        if (vehicle.modifKVP) {
            params[CarFilterKeys.modifKey] = vehicle.modifKVP.key;
        }
        this._navigationService.NavigateWithQueryParams(["search-result"], { queryParams: params });
        return;
    }

    public close: any;
    onNeedAddCar(close: boolean) {
        this.needAddCar = close;
    }

    onAddUserCar(userCar: UserCar) {
        this.needAddCar = false;
        this.userVehiclesList.push(userCar);
        this.selectedUserCar = userCar;
    }

    public showOrNot(): boolean {
        return this.userVehiclesList.length > 0;
    }

    public helpGarage()
    {
        this._userStorage.upsertData("garage-key2step", this.selectedUserCar);
    }

    public activBtnVehicleVin: boolean = false;
    public activBtnVehicleMilage: boolean = false;
    public activBtnVehicleName: boolean = false;
    public activBtnVehicleBirthday: boolean = false;

    public valueInputVehicleVin: string = '';
    public valueInputVehicleMilage: number;
    public valueInputVehicleName: string = '';
    public valueInputVehicleBirthday: Date;

    ngOnChangesVin() {
        if (this.selectedUserCar.vin && this.selectedUserCar.vin.length >= 15) {
            this.activBtnVehicleVin = true;
        }
        else {
            this.activBtnVehicleVin = false;
        }
    }

    ngOnChangesName() {
        if (this.selectedUserCar.ownNameCar && this.selectedUserCar.ownNameCar.length > 0) {
            this.activBtnVehicleName = true;
        }
        else {
            this.activBtnVehicleName = false;
        }
    }

    ngOnChangesMilage() {
        if (this.selectedUserCar.milage > 0) {
            this.activBtnVehicleMilage = true;
        }
        else {
            this.activBtnVehicleMilage = false;
        }
    }

    private canSave(item: number): boolean {
        switch (item) {
            case 1:
                return this.activBtnVehicleVin;
            case 2:
                return this.activBtnVehicleName;
            case 3:
                return this.activBtnVehicleMilage;
        }
    }
}
