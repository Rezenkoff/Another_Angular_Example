import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PravilaPolzovaniaComponent } from './components/pravila-polzovania.component';

const routes: Routes = [
    { path: '', component: PravilaPolzovaniaComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class PravilaPolzovaniaRoutingModule {
}