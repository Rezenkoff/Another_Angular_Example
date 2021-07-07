import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { SharedCommonModule } from '../../../shared/modules/shared-common.module';
import { SharedShopingCartModule } from '../../../shared/modules/shared-shoping-cart.module';

import { FavoriteComponent } from './favorite.component';

import { FavoriteProductService } from '../../../services/favorite-product.service';
import { LocationService } from '../../../location/location.service';
import { DeferLoadModule } from '../../../defer-loader/defer-load.module';

@NgModule({
    imports: [SharedModule, CommonModule, SharedCommonModule, SharedShopingCartModule, DeferLoadModule ],
    declarations: [FavoriteComponent],
    entryComponents: [],
    providers: [FavoriteProductService, LocationService]
})
export class FavoriteModule {

}