import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { VehicleEffects } from './effects/vehicle.effects';
import { vehicleReducer } from './reducers';
import { LastInfoService } from '../order-step/last-info.service';
import { VehicleHttpService } from './services/vehicle-http.service';
import { VehiclePipe } from './pipes/vehicle.pipe';
import { CarSelectPanelModule } from '../car-select-panel/car-select-panel.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MyGarageCarListComponent } from './components/mygarage-carslist.component';
import { VehicleListMyGarageComponent } from './components/vehicle-list-mygarage.component'
import {
    AddVehicleComponent,
    VehicleListComponent,    
    EditVehicleComponent,
    ShortVehicleListComponent,
    UserVehiclesComponent
} from './components';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,        
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('vehicle', vehicleReducer),
        EffectsModule.forFeature([VehicleEffects]),
        CarSelectPanelModule,
        NgxMaskModule.forRoot(options),
    ],
    declarations: [
        VehicleListComponent,
        VehicleListMyGarageComponent,
        VehiclePipe,
        AddVehicleComponent,
        MyGarageCarListComponent,
        EditVehicleComponent,
        ShortVehicleListComponent,
        UserVehiclesComponent
    ],
    entryComponents: [
        AddVehicleComponent,
        MyGarageCarListComponent,
        EditVehicleComponent,
        ShortVehicleListComponent
    ],
    exports: [
        VehicleListComponent,
        VehicleListMyGarageComponent,
        VehicleListMyGarageComponent,
        ShortVehicleListComponent,
        UserVehiclesComponent],
    providers: [VehicleHttpService, LastInfoService]
})

export class VehicleModule {
}