import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet.component';
import { AuthGuard } from '../shared/guards/auth-guard';
import { VehicleComponent } from './child/vehicle/vehicle.component';
import { OrderComponent } from './child/order/order.component';
import { ProfileComponent } from './child/profile/profile.component';
import { ForDevComponent } from './child/fordev/fordev.component';
import { FavoriteComponent } from './child/favorite/favorite.component';
import { OrderRefundComponent } from './child/refund/order.component';
import { MobileInfoComponent } from './child/info/mobile-info.component';

const itemRoutes: Routes = [
    { path: 'info', component: MobileInfoComponent },
    { path: 'vehicle', component: VehicleComponent },
    { path: 'order', component: OrderComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'fordev', component: ForDevComponent },
    { path: 'favorite', component: FavoriteComponent },
    { path: 'refund', component: OrderRefundComponent},
    { path: '', redirectTo: 'order', pathMatch: 'full' },
];

const cabinetRoutes: Routes = [
    { path: '', component: CabinetComponent, canActivate: [AuthGuard], children: itemRoutes }
];
@NgModule({
    imports: [
        RouterModule.forChild(cabinetRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CabinetRoutingModule { }