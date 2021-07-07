import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { BrandsCatalogRoutingModule } from './brands-catalog-routing.module';
import { BrandsCatalogMainComponent } from './components/brands-catalog-main.component';
import { BrandsCatalogSubcategoriesComponent } from './components/brands-catalog-subcategories.component';
import { CategoryLevelComponent } from './components/category-level.component';
import { BrandsSearchComponent } from './components/brands-search.component';
import { SearchModule } from '../search/search.module';
import { BrandsCatalogService } from './service/brands-catalog.service';
import { ReviewsModule } from '../reviews/reviews.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        BrandsCatalogRoutingModule,
        SearchModule,
        ReviewsModule,
    ],
    declarations: [
        BrandsCatalogMainComponent,
        BrandsCatalogSubcategoriesComponent,
        CategoryLevelComponent,
        BrandsSearchComponent,
    ],
    entryComponents: [BrandsCatalogMainComponent],
    exports: [],
    providers: [BrandsCatalogService]
})
export class BrandsCatalogModule {
}