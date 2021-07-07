import { NgModule } from "@angular/core";
import { SparePartSelectComponent } from "./components/spare-part-select.component";
import { SparePartSelectSendOrderComponent } from "./components/spare-part-select-send-order.component";
import { SparePartSelectCarComponent } from "./components/spare-part-select-car.component";
import { TranslateModule } from "../translate/translate.module";

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { CarSelectPanelModule } from "../car-select-panel/car-select-panel.module";
import { SharedModule } from "../shared/modules/shared.module";
import { HomeSharedModule } from "../shared/modules/home-shared.module";

@NgModule({
    declarations: [
        SparePartSelectComponent,
        SparePartSelectCarComponent,
        SparePartSelectSendOrderComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        TranslateModule,
        CommonModule,
        CarSelectPanelModule,
        SharedModule,
        HomeSharedModule,
    ],
    providers: [
    ],
    exports: [
        SparePartSelectComponent,
        SparePartSelectCarComponent,
        SparePartSelectSendOrderComponent
    ]
})
export class SparePartSelectModule { }