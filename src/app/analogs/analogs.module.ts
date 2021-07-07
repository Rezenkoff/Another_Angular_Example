/*MODULES*/
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalogsRoutingModule } from './analogs-routing.module';
import { SharedModule } from '../shared/modules/shared.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { FiltersModule } from '../filters/filters.module';
import { CommonModule } from '@angular/common';
import { SharedShopingCartModule } from '../shared/modules/shared-shoping-cart.module';
import { ForSearchResultsSharedModule } from '../shared/modules/for-search-results.shared.module';

// /*COMPONENTS*/
import { SearchAnalogsComponent } from './components/search-analogs.component';
import { SearchAnalogsListComponent } from './components/search-analogs-list.component';

// /*PIPES, SERVICES*/
import { ProductService } from '../product/product.service';
import { DeferLoadModule } from '../defer-loader/defer-load.module';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,        
        SharedShopingCartModule,
        ForSearchResultsSharedModule,
        FormsModule,
        AnalogsRoutingModule,
        FiltersModule,
        DeferLoadModule
    ],

    declarations: [
        SearchAnalogsComponent,
        SearchAnalogsListComponent
    ],
    exports: [SearchAnalogsListComponent],
    providers: [ProductService]
})

export class AnalogsModule {
}