import { Component, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { CarsPanelStateChange } from '../../car-select-panel/models/cars-panel-state-change.model';
import { UserCar } from '../../vehicle/models/user-car.model';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
import * as carValidator from '../../vehicle/models/car-validator-provider';
import { SelectMeComponent } from '../../detail-groups/child/components/select-me.component';


@Component({
    selector: 'select-by-params-modal',
    templateUrl: './__mobile__/select-by-params-modal.component.html'
})

export class SelectByParamsModalComponent {

    selectedCar: UserCar = new UserCar();

    constructor(
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialogRef: MatDialogRef<SelectByParamsModalComponent>,
        public dialog: MatDialog) {
    }

    public close(): void {
        this.dialogRef.close();
    }

    public onVehicleCreated(): void {
        this.dialogRef.close(this.selectedCar);
    }

    public CarIsValid(): boolean {
        return carValidator.isValidUserCar(this.selectedCar);
    }

    public onCarSelect(): void {

    }

    public updateCarInfo(changes: CarsPanelStateChange[]): void {
        changes.forEach(c => {
            switch (c.filterType) {
                case CarFilterKeys.markKey:
                    this.selectedCar.markKVP = c.selectedOptions[0] || null;
                    this.selectedCar.mark = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';
                    break;
                case CarFilterKeys.serieKey:
                    this.selectedCar.serieKVP = c.selectedOptions[0] || null;
                    this.selectedCar.model = (c.selectedOptions[0]) ? c.selectedOptions[0].value : ''; 
                    break;
                case CarFilterKeys.yearKey:
                    this.selectedCar.yearKVP = c.selectedOptions[0] || null;
                    this.selectedCar.year = (c.selectedOptions[0]) ? c.selectedOptions[0].value : '';    
                    break;
                case CarFilterKeys.modelKey:
                    this.selectedCar.modelKVP = c.selectedOptions[0] || null;
                    break;
                case CarFilterKeys.modifKey:
                    this.selectedCar.modifKVP = c.selectedOptions[0] || null;
                    break;
                default:
                    return;
            }
        });        
    }
    public onShowSelectMeForm(): void {
        this.toggle();
    }
    public toggle(): void {
        let dial = this.dialog.open(SelectMeComponent, {});
        dial.afterClosed().subscribe(result => {
            this.close();
        });
    }
}
