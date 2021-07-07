import { Component, Inject, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { UserCar } from '../../vehicle/models/user-car.model';
import { NavigationService } from '../../services/navigation.service';
import { Store } from '@ngrx/store';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MyGarageCarListComponent } from '../../vehicle/components/mygarage-carslist.component';

@Component({
    selector: 'my-garage',
    templateUrl: './__mobile__/my-garage.component.html',
    styleUrls: ['./__mobile__/styles/my-garage.component__.scss']
})
export class MyGarageComponent extends BaseBlockComponent implements OnInit {
    public cars$: Observable<UserCar[]> = new Observable<UserCar[]>();
    public isShowGarage: boolean = false;
    public close: any;
    public showClose: boolean = false;
    public carCount: number = 0;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialog: MatDialog,
        private _navigationService: NavigationService
    ) {
        super(constants);
    }

    async ngOnInit() {  

        await this._vehicleStore.dispatch(new vehicle.GetVehicleAction());
         this.cars$ = this._vehicleStore.select(fromVehicle.getActiveUserVehicles);
         this.cars$.pipe(takeUntil(this.destroy$)).subscribe(cars => {
             this.carCount = cars.length;
         });
     }
 
     ngOnDestroy() {
         this.destroy$.next(true);
         this.destroy$.unsubscribe();
     }
 
     public getLogo(mark: string): string {
         if (mark == null || mark == undefined)
             return;
         return this.constants.IMAGES.VIN_MODEL_CABINET + mark.toUpperCase() + '.PNG'
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
 
     public toggleGarage() {
         if (this.isShowGarage) {
             this.close.close();
             return;
         }
 
         this.isShowGarage = !this.isShowGarage;
         this.close = this.dialog.open(MyGarageCarListComponent, {
             width: `80%`,
             autoFocus: true,
             data: this.cars$,
             panelClass: 'custom-modalbox'
         });
         this.close.afterClosed().subscribe(result => {
             this.isShowGarage = !this.isShowGarage;
         });      
     }
 
     //onScroll(event) {
     //    this._userStorage.upsertData("scrollEvent", window.pageYOffset.toString());
     //}
 
     public closeMyGarage() {
         this.close.close();
     }
 
     public getStyle(): string {
         return (this.isShowGarage ? "basket__car-btn garage-close" : "basket__car-btn");
     }
}
