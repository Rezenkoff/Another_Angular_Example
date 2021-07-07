/*MODULES*/
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiltersModule } from '../filters/filters.module';
import { SearchRoutingModule } from './search-routing.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { ForSearchResultsSharedModule } from '../shared/modules/for-search-results.shared.module';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedShopingCartModule } from '../shared/modules/shared-shoping-cart.module';
import { AnalogsModule } from '../analogs/analogs.module';
import { DeferLoadModule } from '../defer-loader/defer-load.module';

/*COMPONENTS*/
import { SearchResultComponent } from './components/search-result.component'
import { SearchProductListComponent } from './components/search-product-list.component'

/*PIPES, SERVICES*/
import { SearchEffects } from './effects/search.effects';
import { searchReducer } from './reducers';
import { ProductService } from '../product/product.service';
import { SeoCommonService } from '../services/seo-common.service';
import { CategoryPlusService } from '../services/category-plus.service';
import { CategoryAutoLinkComponent } from './components/category-auto-link.component';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,        
        SharedShopingCartModule,
        ForSearchResultsSharedModule,
        FormsModule,
        SearchRoutingModule,
        StoreModule.forFeature('search', searchReducer),
        EffectsModule.forFeature([SearchEffects]),
        FiltersModule,
        AnalogsModule,
        DeferLoadModule
    ],
    declarations: [
        SearchResultComponent,        
        SearchProductListComponent,
        CategoryAutoLinkComponent
    ],    
    exports: [SearchProductListComponent,
              CategoryAutoLinkComponent
            ],
    providers: [
       ProductService,
       SeoCommonService,
        CategoryPlusService
    ]
})

export class SearchModule {
}