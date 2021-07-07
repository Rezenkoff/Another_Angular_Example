import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KakZakazatComponent } from './components/kak-zakazat.component';

const routes: Routes = [
    { path: '', component: KakZakazatComponent, data: { identificator: 499100005, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class KakZakazatRoutingModule {
}