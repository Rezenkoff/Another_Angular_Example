import { NgModule, ModuleWithProviders } from '@angular/core';
import { PaymentService } from './payment.service';

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})

export class PaymentModule {
    static forRoot(): ModuleWithProviders<PaymentModule> {
        return {
            ngModule: PaymentModule,
            providers: [
                PaymentService
            ]
        }
    }
}