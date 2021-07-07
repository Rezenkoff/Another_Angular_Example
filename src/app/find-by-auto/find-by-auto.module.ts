import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FindByAutoRoutingModule } from './find-by-auto-routing.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { CommonModule } from '@angular/common';
import { LaximoService } from '../services/laximo.service';
import { LastInfoService } from '../order-step/last-info.service';
import { FindByAutoComponent } from './find-by-auto.component';
import { LatestVinCarsComponent } from './child/components/latest-vin-cars.component';
import { VinSearchCarComponent } from './child/components/vinsearch-car.component';

@NgModule({
    imports: [
        CommonModule, 
        SharedCommonModule, 
        SharedModule, 
        VehicleModule, 
        FormsModule, 
        FindByAutoRoutingModule
    ],
    declarations: [
        FindByAutoComponent,
        VinSearchCarComponent,
        LatestVinCarsComponent
    ],
    entryComponents: [],
    providers: [
        LaximoService,
        LastInfoService
    ]
})
export class FindByAutoModule {
}