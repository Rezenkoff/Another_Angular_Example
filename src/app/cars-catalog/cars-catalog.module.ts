import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { CarsCatalogRoutingModule } from './cars-catalog-routing.module';
import { CarsSearchComponent } from './components/cars-search.component';
import { CarsCatalogMainComponent } from './components/cars-catalog-main.component';
import { CarsCatalogSubcategoriesComponent } from './components/cars-catalog-subcategories.component';
import { CategoryLevelComponent } from './components/category-level.component';
import { SearchModule } from '../search/search.module';
import { CarCatalogService } from './services/car-catalog.service';
import { DetailGroupsModule } from '../detail-groups/detail-groups.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        CarsCatalogRoutingModule,
        SearchModule,
        DetailGroupsModule
    ],
    declarations: [
        CarsCatalogMainComponent,
        CarsCatalogSubcategoriesComponent,
        CategoryLevelComponent,
        CarsSearchComponent
    ],
    entryComponents: [CarsCatalogMainComponent],
    exports: [],
    providers: [CarCatalogService]
})

export class CarsCatalogModule {
}