import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultComponent } from './components/search-result.component';

const searchRoutes: Routes = [
    { path: '', component: SearchResultComponent, data: { identificator: 499100008, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(searchRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SearchRoutingModule {
}