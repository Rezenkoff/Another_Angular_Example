import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as search from '../../search/actions/search.actions';
import * as fromSearch from '../../search/reducers';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { Observable } from 'rxjs';
import { UserCar } from '../../vehicle/models/user-car.model';
import { AuthHttpService } from '../../auth/auth-http.service';
//TODO: replace by new Add Vehicle component when this component will be in use
//import { AddVehicleComponent } from '../../search/components/add-vehicle.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'vehicle-filter',
    templateUrl: './__mobile__/user-vehicle-filter.component.html',
    styleUrls: ['./__mobile__/styles/user-vehicle-filter.component__.scss']
})
export class VehicleFilterComponent {

    public id: string = 'vehicle-filter';
    public href: string = '#vehicle-filter';

    selectedCarTypes$: Observable<number[]>;
    selectedCarTypes: number[];
    selectedModels$: Observable<number[]>;
    selectedModels: number[];
    vehicles$: Observable<UserCar[]>;

    constructor(
        private vehicleStore: Store<fromVehicle.State>,
        private searchStore: Store<fromSearch.State>,
        public _authService: AuthHttpService,
        public dialog: MatDialog
    ) {
        this.selectedCarTypes$ = this.searchStore.select(fromSearch.selectedCarTypes);
        this.selectedCarTypes$.subscribe(ids => this.selectedCarTypes = ids);

        this.selectedModels$ = this.searchStore.select(fromSearch.selectedCarModels);
        this.selectedModels$.subscribe(ids => this.selectedModels = ids);

        this.vehicles$ = this.vehicleStore.select(fromVehicle.getVehiclesForFilter);
    }

    ngOnInit() {
        if (this._authService.isAuthenticated())
            this.vehicleStore.dispatch(new vehicle.GetVehicleAction())
        this.vehicles$ = this.vehicleStore.select(fromVehicle.getVehiclesForFilter);
    }

    changeOptionState(vehicle: UserCar, event): void {
        if (event.target.checked) {
            this.searchStore.dispatch(new search.SetCarTypeIdAction(vehicle.markId));
            this.searchStore.dispatch(new search.SetCarModelIdAction(vehicle.modelId));
        }
        else {
            this.searchStore.dispatch(new search.RemoveCarTypeIdAction(vehicle.markId));
            this.searchStore.dispatch(new search.RemoveCarModelIdAction(vehicle.modelId));
        }
    }

    checkOptions(vehicle: UserCar): boolean {
        return this.selectedCarTypes.includes(vehicle.markId) && this.selectedModels.includes(vehicle.modelId);
    }

    openAddVehicleDialog() {
        //TODO: replace by new Add Vehicle component when this component will be in use
        //let dialogRef = this.dialog.open(AddVehicleComponent, {});
    }
}