import { ContactComponent } from './contact.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedCommonModule } from '../../../shared/modules/shared-common.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryPointsAdminService } from '../../../services/delivery-points.service';
import { DeliveryPointModule } from '../../../delivery/points/delivery-point.module';
import { LocationModule } from '../../../location/location.module';
import { LocationService } from '../../../location';
import { StoService } from '../../../sto/sto.service';


const contacRoutes: Routes = [
    { path: '', component: ContactComponent, data: { identificator: 499100002, type: 1 } }
];

@NgModule({
    imports: [
        RouterModule.forChild(contacRoutes),
        SharedCommonModule,
        CommonModule,
        SharedModule,
        DeliveryPointModule,
        LocationModule
    ],
    declarations: [
        ContactComponent
    ],
    providers: [
        DeliveryPointsAdminService,
        LocationService,
        StoService
    ]    
})

export class ContactModule { }