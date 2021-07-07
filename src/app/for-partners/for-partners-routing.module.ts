import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ForPartnersComponent } from "./for-partners.component";

const routes: Routes = [
    { path: '', component: ForPartnersComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ForPartnersRoutingModule { }