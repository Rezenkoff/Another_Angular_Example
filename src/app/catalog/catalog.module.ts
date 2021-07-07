import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { ForSearchResultsSharedModule } from '../shared/modules/for-search-results.shared.module';
import { CommonModule } from '@angular/common';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogMainComponent } from './components/catalog-main.component';
import { CatalogSubCategoriesComponent } from './components/catalog-subcategories.component';
import { CatalogSubSubCategoriesComponent } from './components/catalog-subsubcategories.component';
import { CatalogBannerCategory } from './components/catalog-banner-category.component';
import { SearchModule } from '../search/search.module';
import { FiltersModule } from '../filters/filters.module';
import { ModificationsInfoBlockComponent } from './components/modifications-info-block.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,
        ForSearchResultsSharedModule,
        FormsModule,
        CatalogRoutingModule,
        SearchModule,
        FiltersModule,
        MatExpansionModule
    ],
    declarations: [
        CatalogMainComponent,
        CatalogSubCategoriesComponent,
        CatalogSubSubCategoriesComponent,
        CatalogBannerCategory,
        ModificationsInfoBlockComponent
    ],
    entryComponents: [CatalogMainComponent]
})
export class CatalogModule {

}