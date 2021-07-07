import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiqpayWidgetComponent } from './components/liqpay-widget.component';
import { ScriptService } from '../../lazyloading/script.service';
import { LiqpayService } from './liqpay.service';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [LiqpayWidgetComponent],
    declarations: [LiqpayWidgetComponent],
    providers: [ScriptService, LiqpayService]
})
export class LiqPayModule {

}