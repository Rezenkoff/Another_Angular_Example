import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DostavkaIOplataComponent } from './components/dostavka-i-oplata.component';

const routes: Routes = [
    { path: '', component: DostavkaIOplataComponent, data: { identificator: 499100003, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DostavkaIOplataRoutingModule {
}