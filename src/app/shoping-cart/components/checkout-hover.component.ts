import { Component, Input } from '@angular/core';
import { CheckoutStepTypesEnum } from '../models/checkout-step-types.enum';

@Component({
    selector: 'checkout-hover',
    templateUrl: './__mobile__/checkout-hover.component.html'
})
export class CheckoutHoverComponent {
    @Input() inProcess: boolean = false;
    @Input() stepType: CheckoutStepTypesEnum = CheckoutStepTypesEnum.None;
    checkoutStepTypesEnum = CheckoutStepTypesEnum;
}