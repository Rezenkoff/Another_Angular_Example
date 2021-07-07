import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { AlertService } from '../../services/alert.service';
import { UploadService } from '../../services/upload.service';
import { NavigationService } from '../../services/navigation.service';
import { UserStorageService } from '../../services/user-storage.service';
//import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import { Observable, Subject } from 'rxjs';
//import { CarsPanelStateChange } from '../../car-select-panel/models/cars-panel-state-change.model';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
//import * as carValidator from '../../vehicle/models/car-validator-provider';
import { EventEmitter } from '@angular/core';
//import { VehicleHttpService } from '../services/vehicle-http.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'mygarage-carlist',
    templateUrl: './__mobile__/mygarage-carslist.component.html',
    styleUrls: ['./__mobile__/styles/mygarage-carslist.component__.scss'],
    encapsulation: ViewEncapsulation.None
})


export class MyGarageCarListComponent {

    public needAddCar: boolean = false;
    public onNeedClose: EventEmitter<boolean> = new EventEmitter<boolean>();
    public userCarsList: Array<UserCar>;
    public selectedUserCar: UserCar;
    public fileNames: string;
    public file: File;
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
    public isNeedEdit: boolean = false;
    public close: any;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    public activBtnVehicleVin: boolean = false;
    public activBtnVehicleMilage: boolean = false;
    public activBtnVehicleName: boolean = false;
    public activBtnVehicleBirthday: boolean = false;

    public valueInputVehicleVin: string = '';
    public valueInputVehicleMilage: number;
    public valueInputVehicleName: string = '';
    public valueInputVehicleBirthday: Date;

    constructor(
        public dialogRef: MatDialogRef<MyGarageCarListComponent>,
        private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        private _uploadService: UploadService,
        private _alertService: AlertService,
        private _navigationService: NavigationService,
        private _userStorage: UserStorageService,
        @Inject(MAT_DIALOG_DATA) public data: Observable<any>) {       
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
     
        this.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.userCarsList = data;

            if (this.selectedUserCar == null) {
                this.selectedUserCar = data[0];
            }

            this.textData();
        }); 

        let top = document.getElementById("garage").getBoundingClientRect().bottom + 9;

        this.dialogRef.updatePosition({
            top: `${top}px`
        });

    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
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

    private validDate():void {
        if (this.dateDays.includes(this.day) && this.dateMonth.includes(this.month) && this.dateYear.includes(this.year)) {
            this.activBtnVehicleBirthday = true;
        }
        else {
            this.activBtnVehicleBirthday = false;
        }
    }

    public addCarToMyGarage() {
        this.needAddCar = !this.needAddCar; 
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

    onNeedAddCar(close: boolean) {
        this.needAddCar = close;

        if (this.selectedUserCar == null) {
            this.dialogRef.close();
        }      
    }

    onAddUserCar(newCar: UserCar) {
        this.userCarsList.push(newCar);
    }

    changeActive(userVehicle: UserCar) {
        this._vehicleStore.dispatch(new vehicle.ChangeIsActive(userVehicle));
        let index = this.userCarsList.indexOf(userVehicle);
        this.userCarsList.splice(index, 1);

        this.selectedUserCar = this.userCarsList[0];
    }

    closeMyGarage() {
        this.dialogRef.close();
    }

    public fileChangeEvent(fileIn: any): void {
        if (fileIn.target.files.length != 0 && this.checkFilesSize(fileIn.target.files)) {

            this.file = fileIn.target.files[0];

            this._uploadService.uploadFile(this.file,'upload/image-garage').subscribe(data => {
                this.selectedUserCar.urlImg = data.data;
                this.editVehicle();
            });
        }
        else if (!this.checkFilesSize(fileIn.target.files)) {
            this._alertService.error('Превышен максимальный размер файлов');
        }
    }

    private checkFilesSize(files: any): boolean {
        let filesArray = [].slice.call(files);
        return filesArray.map(f => f.size).reduce((a, b) => a + b, 0) < this._constants.FILE.MAX_SIZE;
    }

    public editVehicle() {
        this._vehicleStore.dispatch(new vehicle.EditVehicleAction(this.selectedUserCar));
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
                if (this.selectedUserCar.milage == null || this.selectedUserCar.milage  == 0) {
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

    public saveBirthday() {
        if (this.dateDays.includes(this.day) && this.dateMonth.includes(this.month) && this.dateYear.includes(this.year)) {

            this.selectedUserCar.birthdayCar = new Date();
            this.selectedUserCar.birthdayCar.setFullYear(Number(this.year));
            this.selectedUserCar.birthdayCar.setMonth(this.dateMonth.indexOf(this.month));
            this.selectedUserCar.birthdayCar.setDate(Number(this.day));


            this._vehicleStore.dispatch(new vehicle.EditVehicleAction(this.selectedUserCar));
            this.day = '';
            this.month = '';
            this.year = '';
            this.activBtnVehicleBirthday = false;
            this._alertService.success("Дата сохранена");
        }
        else {
            this._alertService.warn("Заполните все поля пожалуйста");
        }
    }

    public needEditVehicle() {
        this.isNeedEdit = !this.isNeedEdit;
    }

    public getBirthdaySelectedCar(): string {
        let birthday = new Date(this.selectedUserCar.birthdayCar);

        if (birthday.getFullYear() < 1970) {
            return '';
        }
        else {
            return `${birthday.getDate()} ${this.dateMonthEnd[birthday.getMonth()]}, ${birthday.getFullYear()}`;
        }
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

    public closeGarage(item: number): void {   
        if (item == 1) {
            this.navigate(this.selectedUserCar);
        }
        else {
            this._userStorage.upsertData("garage-key2step", this.selectedUserCar);
        }
        this.dialogRef.close();        
    }
    public navigate(vehicle: UserCar): void {

        let params: Object = {};
        
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
}
