
import { SharedCommonModule } from '../../../shared/modules/shared-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryPointModule } from '../../../delivery/points/delivery-point.module';
import { LocationModule } from '../../../location/location.module';
import { LocationService } from '../../../location/location.service';
import { StoService } from '../../../sto/sto.service';
import { VehicleTypeSwitchComponent } from './vehicle-type-switch.component';
import { StoRoutingModule } from '../../../sto/sto-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
    imports: [
        SharedCommonModule,
        CommonModule,
        //SharedModule,
        DeliveryPointModule,        
        LocationModule,
        StoRoutingModule,
        FormsModule,
        LocationModule,
    ],
    declarations: [
        VehicleTypeSwitchComponent
    ],
    providers: [
        LocationService,
        StoService
    ]
})

export class VehicleTypeSwitchModule { }