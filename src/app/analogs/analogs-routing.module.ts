import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAnalogsComponent } from './components/search-analogs.component';

const searchRoutes: Routes = [
    { path: '', component: SearchAnalogsComponent, data: { identificator: 499100015, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(searchRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AnalogsRoutingModule {
}