import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { FavoriteModule } from './child/favorite/favorite.module';
import { CabinetComponent } from './cabinet.component';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { ProfileService } from './child/profile/profile.service';
import { ForDevComponent } from './child/fordev/fordev.component';
import { VehicleComponent } from './child/vehicle/vehicle.component';
import { OrderComponent } from './child/order/order.component';
import { ProfileComponent } from './child/profile/profile.component';
import { MobileInfoComponent } from './child/info/mobile-info.component';
import { VinSearchService } from '../services/vinsearch.service';
import { ForDevService } from './child/fordev/fordev.service';
import { VehicleModule } from '../vehicle/vehicle.module';
import { OrderRefundComponent } from './child/refund/order.component';
import { AuthGuard } from '../shared/guards/auth-guard';

@NgModule({
    imports: [CommonModule, SharedCommonModule, SharedModule, FormsModule, 
        CabinetRoutingModule, VehicleModule, FavoriteModule
    ],
    declarations: [MobileInfoComponent, CabinetComponent, VehicleComponent, OrderComponent, ForDevComponent, ProfileComponent, OrderRefundComponent],
    providers: [ForDevService, ProfileService,  VinSearchService, AuthGuard]
})
export class CabinetModule {

}

