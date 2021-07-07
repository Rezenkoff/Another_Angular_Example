import { NgModule } from '@angular/core';
import { HttpLocationService } from './http-location.service';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
//import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { AreaComponent } from './area/settlement-area.component';
import { AreaListComponent } from './area/area-list.component';
import { SettlementDropdownComponent } from './settlement/settlement-dropdown.component';
import { SettlementService } from './settlement/settlement.service';
import { DistrictComponent } from './district/district.component';
import { DistrictService } from './district/district.service';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        //SharedModule
    ],
    declarations: [
        AreaComponent,
        AreaListComponent,
        SettlementDropdownComponent,
        DistrictComponent
    ],
    exports: [
        AreaComponent,
        AreaListComponent,
        SettlementDropdownComponent,
        DistrictComponent
    ],
    providers: [
        HttpLocationService,
        SettlementService,
        DistrictService
    ]
})
export class LocationModule {
}